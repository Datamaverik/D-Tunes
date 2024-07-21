import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import UserRoutes from "./routes/users";
import SongRoutes from "./routes/spotify";
import TrackRoutes from './routes/tracks'
import PlaylistRoutes from "./routes/playlist";
import cookieParser from "cookie-parser";
import createHttpError, { isHttpError } from "http-errors";
import env from "./utils/validateEnv";

const app = express();

app.use(
  cors({
    origin: env.FRONT_END_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", UserRoutes);
app.use("/api/tracks", TrackRoutes);
app.use("/api/songs", SongRoutes);
app.use("/api/playlist",PlaylistRoutes);

//  for catching the unknown route calling errors
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//  To catch unknown/ internal sever errors
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ message: errorMessage });
});

export default app;
