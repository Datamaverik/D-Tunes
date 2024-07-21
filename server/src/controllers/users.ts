import bcrypt from "bcrypt";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/users";
import sendCookie from "../utils/saveCookie";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";

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

    let updatedUser = await UserModel.findById(userId).exec();
    if (updatedUser) {
      if (email) updatedUser.email = email;
      if (passwordHashed) updatedUser.password = passwordHashed;
      updatedUser.isArtist = isArtist;
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
