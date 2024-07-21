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
  liked_songs: { type: [String], default: [] },
  isArtist: { type: Boolean, default: false },
  published_songs: { type: [Schema.Types.ObjectId], default: [] },
  followers: { type: Number, default: 0 },
});

type User = InferSchemaType<typeof UserSchema>;
export default model<User>("User", UserSchema);
