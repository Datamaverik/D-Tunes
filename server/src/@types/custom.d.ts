import mongoose from "mongoose";

declare module "express" {
  interface Request {
    userId?: mongoose.Types.ObjectId;
  }
}
