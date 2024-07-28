import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";
import dotenv from "dotenv";

dotenv.config();

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port(),
  JWT_SECRET: str(),
  FRONT_END_URL: str(),
  SPOTIFY_CLIENT_ID: str(),
  SPOTIFY_CLIENT_SECRET: str(),
  SPOTIFY_BASE_URL: str(),
  SPOTIFY_TOKEN_ENDPOINT: str(),
  TOKEN_ID: str(),
  CLOUDINARY_KEY: str(),
  CLOUDINARY_SECRET: str(),
  CLOUD_NAME: str(),
  GENIUS_ACCESS_TOKEN: str(),
  DATUTH_CLIENT_ID: str(),
  DAUTH_CLIENT_SECRET: str(),
});