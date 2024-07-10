import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";
import dotenv from 'dotenv';

dotenv.config();

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port(),
  JWT_SECRET: str(),
});
