import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import { Response } from "express";

const generateToken = (userId: mongoose.Types.ObjectId): string => {
  return jwt.sign({ userId }, env.JWT_SECRET!, { expiresIn: "1h" });
};
const sendCookie = (id: mongoose.Types.ObjectId, res: Response): void => {
  const token = generateToken(id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });
};

export default sendCookie;
