import { RequestHandler } from "express";
import env from "../utils/validateEnv";
import { getLyrics } from "genius-lyrics-api";

const apiKey = env.GENIUS_ACCESS_TOKEN;

export const getSongLyrics: RequestHandler = async (req, res, next) => {
  const title = req.body.title;
  const artist = req.body.artist;
  const options = {
    apiKey,
    title,
    artist,
    optimizedQuery: true,
  };
  try {
    const response = await getLyrics(options);
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
