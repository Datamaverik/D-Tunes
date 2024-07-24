import bcrypt from "bcrypt";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/users";
import sendCookie from "../utils/saveCookie";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import * as CloudinaryController from "../utils/cloudinary";
import axios from "axios";

const client_id = env.DATUTH_CLIENT_ID;
const client_secret = env.DAUTH_CLIENT_SECRET;
const dauth_redirect_url = " http://localhost:5000/api/users/authenticate";

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
  isArtist?: boolean;
}
export const signUp: RequestHandler<unknown, unknown, SignUpBody> = async (
  req,
  res,
  next
) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters missing");
    }
    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();

    if (existingUsername)
      throw createHttpError(409, "Username is already taken");
    const existingEmail = await UserModel.findOne({
      email: email,
    }).exec();

    if (existingEmail)
      throw createHttpError(409, "Email already exists. Login instead");

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });
    sendCookie(newUser._id, res);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (er) {
    next(er);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  const email = req.body.email;
  const isArtist = req.body.isArtist;
  const passwordRaw = req.body.password;
  try {
    if (email) {
      const existingEmail = await UserModel.findOne({
        email,
      }).exec();

      if (existingEmail) throw createHttpError(409, "Email already exists.");
    }
    let passwordHashed: string | null = null;
    if (passwordRaw) passwordHashed = await bcrypt.hash(passwordRaw, 10);

    let defaultImgURL: string = "";
    let imgPublicId: string = "";
    console.log(req.file);
    if (req.file) {
      const response = await CloudinaryController.uploadOnCloudinary(
        req.file.path
      );
      if (response) {
        defaultImgURL = response.url;
        imgPublicId = response.public_id;
      }
    }
    let updatedUser = await UserModel.findById(userId).exec();
    if (updatedUser) {
      if (updatedUser.public_id) {
        await CloudinaryController.deleteFromCloudinary(updatedUser.public_id);
      }
      if (email) updatedUser.email = email;
      if (passwordHashed) updatedUser.password = passwordHashed;
      updatedUser.isArtist = isArtist;
      if (defaultImgURL !== "") updatedUser.profileImgURL = defaultImgURL;
      updatedUser.public_id = imgPublicId;
      await updatedUser.save();
      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username?: string;
  password?: string;
}
export const login: RequestHandler<unknown, unknown, LoginBody> = async (
  req,
  res,
  next
) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password)
      throw createHttpError(400, "Parameters missing");

    const user = await UserModel.findOne({ username })
      .select("+password +email")
      .exec();
    if (!user) throw createHttpError(401, "Invalid credentials");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw createHttpError(401, "Invalid credentials");

    sendCookie(user._id, res);
    res.status(200).json({ message: "Login successful", user });
  } catch (er) {
    next(er);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const response = await UserModel.findByIdAndDelete(userId);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};

export const searchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query.q as string;
  if (!query) throw createHttpError(400, "query not provided");

  try {
    const users = await UserModel.find({ username: new RegExp(query, "i") });
    res.status(200).json(users);
  } catch (er) {
    next(er);
  }
};

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //  verifying token from cookies
    const token = req.cookies.token;
    if (!token) throw createHttpError(401, "Unatuthorized: No token provided");
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: mongoose.Types.ObjectId;
    };
    const user = await UserModel.findById(decoded.userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    res.status(200).json({ user });
  } catch (er) {
    next(er);
  }
};

export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) throw createHttpError(401, "Unatuthorized: No token provided");
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: mongoose.Types.ObjectId;
    };
    const user = await UserModel.findById(decoded.userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    const songId = req.body.songId;
    if (!songId) throw createHttpError(400, "Song id not provided");

    if (user.liked_songs.includes(songId)) {
      user.liked_songs = user.liked_songs.filter((id) => id !== songId);
    } else {
      user.liked_songs.push(songId);
    }
    await user.save();
    res.status(200).json(user.liked_songs);
  } catch (er) {
    next(er);
  }
};

export const fetchLikedSongs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) throw createHttpError(401, "Unatuthorized: No token provided");
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: mongoose.Types.ObjectId;
    };
    const user = await UserModel.findById(decoded.userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    res.status(200).json(user.liked_songs);
  } catch (er) {
    next(er);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findById(userId).exec();
    if (user) return res.status(200).json(user);
    else return res.status(404).json({ message: "user not found" });
  } catch (er) {
    next(er);
  }
};

// export const dAuthAuthenticate: RequestHandler = async (req, res, next) => {
//   const { code, state } = req.query;
//   console.log(req.query);
//   try {
//     if (!state) throw createHttpError(400, "Invalid state");

//     const tokenResponse = await axios.post(
//       "https://auth.delta.nitt.edu/api/oauth/token",
//       null,
//       {
//         params: {
//           client_id: client_id,
//           client_secret: client_secret,
//           grant_type: "authorization_code",
//           code,
//           redirect_uri: "http://localhost:5000/api/users/authenticate",
//         },
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const { access_token } = tokenResponse.data;
//     console.log(access_token);
//     const userDataResponse = await axios.post(
//       "https://auth.delta.nitt.edu/api/resources/user",
//       null,
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//         },
//       }
//     );

//     console.log(userDataResponse.data);
//     const userInfo = userDataResponse.data;

//     const user = await UserModel.findOne({ email: userInfo.email }).exec();
//     if (!user) {
//       const newUser = await UserModel.create({
//         username: userInfo.name,
//         email: userInfo.email,
//         password: null,
//       });
//       sendCookie(newUser._id, res);
//       console.log(newUser);
//       res.status(200).json({ message: "Sign Up successful" });
//     } else {
//       console.log(user);
//       sendCookie(user._id, res);
//       res.status(200).json({ message: "Login successful", user });
//     }
//   } catch (er) {
//     next(er);
//   }
// };

export const dAuthAuthenticate: RequestHandler = async (req, res, next) => {
  const { code, state } = req.query;

  try {
    if (!state) throw createHttpError(400, "Invalid state");
    if (typeof code !== "string") throw createHttpError(400, "Invalid code");

    const queryparams = {
      client_id: "HKEkBu-lR.2ZoPhz",
      client_secret: "8F9Z22At5vZac~jadqSutR448EZhYs8r",
      redirect_uri: "http://localhost:5000/api/users/authenticate",
      grant_type: "authorization_code",
      code: code,
    };
    const URL = "https://auth.delta.nitt.edu/api/oauth/token";

    const response = await axios.post(
      URL,
      new URLSearchParams(queryparams).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Access Token Response:", response.data);

    const { access_token } = response.data;

    const userResources = await axios.post(
      "https://auth.delta.nitt.edu/api/resources/user",
      {},
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userInfo = userResources.data;
    console.log(userInfo);

    const user = await UserModel.findOne({ email: userInfo.email }).exec();
    if (!user) {
      const newUser = await UserModel.create({
        username: userInfo.name,
        email: userInfo.email,
        password: null,
      });
      sendCookie(newUser._id, res);
      console.log(newUser);
      res.status(200).json({ message: "Sign Up successful" });
    } else {
      console.log(user);
      sendCookie(user._id, res);
      res.status(200).json({ message: "Login successful", user });
    }
  } catch (er) {
    next(er);
  }
};
