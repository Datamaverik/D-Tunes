import { InferSchemaType, Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    minLength: 3,
    maxLength: 255,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    kMaxLength: 255,
    minLegth: 3,
    unique: true,
  },
  password: { type: String, required: true, minLength: 3, maxLength: 255 },
});

type User = InferSchemaType<typeof UserSchema>;
export default model<User>("User", UserSchema);
