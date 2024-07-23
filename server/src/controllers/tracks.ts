import TrackModel from "../models/tracks";
import UserModel from "../models/users";
import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import mongoose from "mongoose";
import * as CloudinaryController from "../utils/cloudinary";

export const saveTrack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const name = req.body.name;
  const duration_ms = req.body.duration_ms;
  const genre = req.body.genre;
  try {
    const token = req.cookies.token;
    if (!token) throw createHttpError(401, "Unatuthorized: No token provided");

    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: mongoose.Types.ObjectId;
    };
    const user = await UserModel.findById(decoded.userId).exec();
    if (!user) throw createHttpError(404, "User not found");

    if (!name) throw createHttpError(404, "Name not provided");
    if (!duration_ms) throw createHttpError(404, "Dration not provided");
    if (!genre) throw createHttpError(404, "Genre not provided");

    let imgPublicId: string = "";
    let songPublicId: string = "";
    let defaultImgURL: string = "https://i.ibb.co/vB2GsrM/default-playlist.png";
    let defaultSongURL: string = "";
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imgResponse = await CloudinaryController.uploadOnCloudinary(
        files.image[0].path
      );
      const songResponse = await CloudinaryController.uploadOnCloudinary(
        files.song[0].path
      );
      if (imgResponse && songResponse) {
        defaultImgURL = imgResponse.url;
        defaultSongURL = songResponse.url;
        imgPublicId = imgResponse.public_id;
        songPublicId = songResponse.public_id;
      }
    }

    const newPlaylist = await TrackModel.create({
      artist: user._id,
      artists: [{ name: user.username }],
      name,
      preview_url: defaultSongURL,
      duration_ms,
      public_id: songPublicId,
      genre,
      album: {
        images: {
          height: 60,
          width: 60,
          url: defaultImgURL,
          public_id: imgPublicId,
        },
      },
    });
    res.status(201).json(newPlaylist);
  } catch (er) {
    next(er);
  }
};

export const removeTrack: RequestHandler = async (req, res, next) => {
  const trackId = req.params.trackId;
  try {
    const track = await TrackModel.findById(trackId).exec();
    if (!track)
      return res.status(404).json({ message: "The given track was not found" });

    const imgPublicId = track.public_id;
    if (!track.album)
      return res.status(404).json({ message: "Track's album was not found" });
    const songPublicId = track.album.images[0].public_id;
    console.log(imgPublicId);
    console.log(songPublicId);
    const imgRes = await CloudinaryController.deleteFromCloudinary(imgPublicId);
    const songRes = await CloudinaryController.deleteFromCloudinary(
      songPublicId
    );
    console.log(imgRes);
    console.log(songRes);

    const response = await TrackModel.findByIdAndDelete(trackId);
    return res.status(201).json(response);
  } catch (er) {
    next(er);
  }
};

export const getPublishedTracks: RequestHandler = async (req, res, next) => {
  const artistId = req.params.artistId;
  try {
    const response = await TrackModel.find({ artist: artistId }).exec();
    return res.status(200).json(response);
  } catch (er) {
    next(er);
  }
};

export const getTrackByID: RequestHandler = async (req, res, next) => {
  const trackId = req.params.trackId;
  try {
    const track = await TrackModel.findById(trackId).exec();
    return res.status(200).json(track);
  } catch (er) {
    next(er);
  }
};

export const getTracksByUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const tracks = await TrackModel.find({ artist: userId }).exec();
    return res.status(200).json(tracks);
  } catch (er) {
    next(er);
  }
};

export const getTracksByName: RequestHandler = async (req, res, next) => {
  const query = req.query.q as string;
  if (!query) throw createHttpError(400, "query not provided");

  try {
    const tracks = await TrackModel.find({ name: new RegExp(query, "i") });
    res.status(200).json(tracks);
  } catch (er) {
    next(er);
  }
};
