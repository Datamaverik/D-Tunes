import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import PlaylistModel from "../models/playlist";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import UserModel from "../models/users";
import * as CloudinaryController from "../utils/cloudinary";

export const createPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const name = req.body.name;
  const isPublic = req.body.isPublic;
  const imageUrl = req.body.imageUrl;
  try {
    const token = req.cookies.token;
    if (!token) throw createHttpError(401, "Unatuthorized: No token provided");
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: mongoose.Types.ObjectId;
    };
    const user = await UserModel.findById(decoded.userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    if (!name) throw createHttpError(400, "Parameters not provided");

    const existingPlaylistName = await PlaylistModel.findOne({
      name,
    }).exec();
    if (existingPlaylistName)
      throw createHttpError(409, "Playlist name is already taken");

    let publicId: string = "";
    let defaultImgURL: string | null =
      "https://i.ibb.co/vB2GsrM/default-playlist.png";
    if (req.file) {
      const response = await CloudinaryController.uploadOnCloudinary(
        req.file.path
      );
      if (response) {
        defaultImgURL = response?.url;
        publicId = response.public_id;
      }
    }

    const newPlaylist = await PlaylistModel.create({
      author: user._id,
      name,
      isPublic,
      images: imageUrl
        ? [{ height: 60, width: 60, url: imageUrl }]
        : [
            {
              height: 60,
              width: 60,
              url: defaultImgURL,
              public_id: publicId,
            },
          ],
      songs: [],
    });
    res.status(201).json(newPlaylist);
  } catch (er) {
    next(er);
  }
};

export const getAllPublicPlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playlists = await PlaylistModel.find({ isPublic: true }).exec();
  res.status(200).json(playlists);
};

export const getUserPvtPlaylists = async (
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

    const playlists = await PlaylistModel.find({
      author: user._id,
      isPublic: false,
    }).exec();
    res.status(200).json(playlists);
  } catch (er) {
    next(er);
  }
};

export const getUserAllPlaylists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //  should've asked for userId from req parameters instead of getting it from cookies
    const token = req.cookies.token;
    if (!token) throw createHttpError(401, "Unatuthorized: No token provided");
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: mongoose.Types.ObjectId;
    };
    const user = await UserModel.findById(decoded.userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    const playlists = await PlaylistModel.find({ author: user._id }).exec();
    res.status(200).json(playlists);
  } catch (er) {
    console.error(er);
  }
};

export const getPlaylistById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playlist = await PlaylistModel.findById(req.params.playlistId).exec();
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });
  res.status(200).json(playlist);
};

export const addRemSongFromPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playlistId = req.params.playlistId;
  const songId = req.body.song;
  const duration = req.body.duration;
  try {
    const playlist = await PlaylistModel.findById(playlistId).exec();
    if (!playlist) throw createHttpError(404, "Playlist not found");

    let isRemoved = false;
    if (playlist.songs.includes(songId)) {
      console.log("found");
      playlist.songs = playlist.songs.filter((song) => song !== songId);
      playlist.duration -= duration;
      isRemoved = true;
    } else {
      playlist.duration += duration;
      playlist.songs.push(songId);
    }
    await playlist.save();
    if (isRemoved)
      return res.status(201).json({ message: "Removing song from playlist" });
    else
      return res.status(200).json({ message: "Adding song to the playlist" });
  } catch (er) {
    next(er);
  }
};

export const updatePlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playlistId = req.params.playlistId;
  const name = req.body.name;
  const isPublic = req.body.isPublic;
  const images = req.body.images;
  try {
    const playlist = await PlaylistModel.findById(playlistId).exec();
    if (!playlist) throw createHttpError(404, "Playlist not found");

    const existingPlaylistName = await PlaylistModel.findOne({
      name,
    }).exec();
    if (existingPlaylistName)
      throw createHttpError(409, "Playlist name is already taken");

    playlist.name = name;
    playlist.isPublic = isPublic;
    playlist.images = images;

    await playlist.save();
    res.status(201).json(playlist);
  } catch (er) {
    next(er);
  }
};

export const removePlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playlistId = req.params.playlistId;
  try {
    const playlist = await PlaylistModel.findById(playlistId).exec();
    if (!playlist)
      throw createHttpError(404, "Some error occured while deleting playlist");

    const public_id = playlist.images[0].public_id;
    if (public_id) {
      const response = await CloudinaryController.deleteFromCloudinary(
        public_id
      );
      console.log(response);
    }
    await PlaylistModel.findByIdAndDelete(playlistId);
    res.status(200).json(playlist);
  } catch (er) {
    console.error(er);
  }
};

export const getUserPublicPlaylistById: RequestHandler = async (
  req,
  res,
  next
) => {
  const userId = req.params.userId;
  try {
    const user = await UserModel.findById(userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    const playlists = await PlaylistModel.find({
      $and: [{ author: user._id }, { isPublic: true }],
    }).exec();
    res.status(200).json(playlists);
  } catch (er) {
    next(er);
  }
};
