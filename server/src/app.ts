import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import UserRoutes from "./routes/users";
import cookieParser from 'cookie-parser';
import createHttpError, { isHttpError } from "http-errors";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", UserRoutes);

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
