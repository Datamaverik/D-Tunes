import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import PlaylistModel from "../models/playlist";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import UserModel from "../models/users";
import env from "../utils/validateEnv";

export const createPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const name = req.body.name;
  const isPublic = req.body.isPublic;
  const imageUrl = req.body.imageUrl;
  const songs = req.body.songs;
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
              url: "https://i.ibb.co/vB2GsrM/default-playlist.png",
            },
          ],
      songs,
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

    // let songFound:boolean=false;
    // playlist.songs.map(song=>{
    //   if(song===songId)songFound=true;
    // })

    if (playlist.songs.includes(songId)) {
      console.log("found");
      playlist.songs = playlist.songs.filter((song) => song !== songId);
      playlist.duration -= duration;
    } else {
      playlist.duration += duration;
      playlist.songs.push(songId);
    }
    await playlist.save();
    res.status(200).json(playlist.songs);
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
    const playlist = await PlaylistModel.findByIdAndDelete(playlistId).exec();
    if (!playlist)
      throw createHttpError(404, "Some error occured while deleting playlist");
    res.status(200).json(playlist);
  } catch (er) {
    console.error(er);
  }
};
