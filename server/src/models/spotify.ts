import { InferSchemaType, Schema, model } from "mongoose";

const TokenSchema = new Schema({
  access_token: { type: String, required: true },
  expires_at: { type: Number, required: true },
});

type Token = InferSchemaType<typeof TokenSchema>;
export default model<Token>("Token", TokenSchema);
