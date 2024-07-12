import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";
import * as SpotifyController from '../controllers/spotify';
import tokenModel from '../models/spotify';
import env from '../utils/validateEnv';

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken =await tokenModel.findById(env.TOKEN_ID);
  if(!accessToken){
    createHttpError(500,"can't access token");
    return;
  }
  const expiresAt = accessToken.expires_at;
  try {
    if (!accessToken || (expiresAt && Date.now() >= expiresAt)) {
      await SpotifyController.getSpotifyToken();
    }
    req.accessToken = accessToken.access_token;
    next();
  } catch (er) {
    createHttpError(500, "Failed to refresh token");
  }
};
