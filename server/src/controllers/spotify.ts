import axios from "axios";
import env from "../utils/validateEnv";
import createHttpError from "http-errors";
import { NextFunction, Request, RequestHandler, Response } from "express";
import tokenModel from "../models/spotify";

const clientId = env.SPOTIFY_CLIENT_ID;
const clientSecret = env.SPOTIFY_CLIENT_SECRET;
const tokenEndpoint = env.SPOTIFY_TOKEN_ENDPOINT;
const baseURL = env.SPOTIFY_BASE_URL;

interface AccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export let tokenExpiresAt: number | null = null;

export const getSpotifyToken = async () => {
  try {
    const response = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 200) {
      tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
      const token = await tokenModel.findById(env.TOKEN_ID).exec();

      if (!token) createHttpError(500, "token not found");
      else {
        token.access_token = response.data.access_token;
        token.expires_at = tokenExpiresAt;
        await token.save();
        console.log("Token refreshed Successfully");
      }
    } else createHttpError(500, "Error while fetching token");
  } catch (er) {
    console.error(er);
  }
};

export const getSpotifyGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = await tokenModel.findById(env.TOKEN_ID);
  const accessToken = token?.access_token;
  try {
    const response = await axios.get(
      `${baseURL}/browse/categories?locale=sv_US`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.json(response.data.categories.items);
  } catch (er) {
    console.error(er);
    next(er);
  }
};

export const getPlaylistsByGenre = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const genreId = req.params.genreId;
  const token = await tokenModel.findById(env.TOKEN_ID);
  const accessToken = token?.access_token;
  try {
    const response = await axios.get(
      `${baseURL}/browse/categories/${genreId}/playlists?limit=15`,
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    res.status(200).json(response.data.playlists.items);
  } catch (er) {
    console.error(er);
    next(er);
  }
};
export const getPlaylistById: RequestHandler = async (req, res, next) => {
  const playlistId = req.params.playlistId;
  const token = await tokenModel.findById(env.TOKEN_ID);
  const accessToken = token?.access_token;
  try {
    const response = await axios.get(`${baseURL}/playlists/${playlistId}`, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    return res.status(200).json(response.data);
  } catch (er) {
    console.error(er);
    next(er);
  }
};

export const getTracksOfPlaylist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const playlistId = req.params.playlistId;
  const token = await tokenModel.findById(env.TOKEN_ID);
  const accessToken = token?.access_token;
  try {
    const response = await axios.get(
      `${baseURL}/playlists/${playlistId}/tracks?limit=15`,
      {
        headers: { Authorization: "Bearer " + accessToken },
      }
    );
    res.status(200).json(response.data.items);
  } catch (er) {
    console.error(er);
    next(er);
  }
};

export const getTrack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const trackId = req.params.trackId;
  const token = await tokenModel.findById(env.TOKEN_ID);
  const accessToken = token?.access_token;
  try {
    const response = await axios.get(`${baseURL}/tracks/${trackId}`, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    res.status(200).json(response.data);
  } catch (er) {
    console.error(er);
    next(er);
  }
};

export const searchSpotify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query.q as string;
  if (!query) throw createHttpError(400, "Query is not provided");

  try {
    const token = await tokenModel.findById(env.TOKEN_ID);
    const accessToken = token?.access_token;

    const response = await axios.get(`${baseURL}/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: "track",
      },
    });
    res.status(200).json(response.data.tracks.items);
  } catch (er) {
    next(er);
  }
};
