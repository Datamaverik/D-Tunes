import { NextFunction, Request, Response } from "express";
import env from "../utils/validateEnv";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const auhteticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) throw createHttpError(401, "Unatuthorized: No token provided");

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET!) as {
      userId: mongoose.Types.ObjectId;
    };
    req.userId = decoded.userId;
    next();
  } catch (er) {
    next(er);
  }
};
