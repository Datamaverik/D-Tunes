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
  profileImgURL: {
    type: String,
    default: "https://i.ibb.co/WnTMDjS/default-Pfp.jpg",
  },
  public_id: { type: String, default: "" },
  friends: {
    type: [
      {
        requester: { type: Schema.Types.ObjectId, ref: "User" },
        recipient: { type: Schema.Types.ObjectId, ref: "User" },
        status: {
          type: Number,
          enums: [
            0, //  add friend
            1, //  requested
            2, //  pending
            3, //  friends
          ],
        },
      },
    ],
    default: [],
  },
  trackHistory: { type: [String], default: [] },
  albumHistory: { type: [String], default: [] },
  showHistory: { type: Boolean, default: false },
});

type User = InferSchemaType<typeof UserSchema>;
export default model<User>("User", UserSchema);
