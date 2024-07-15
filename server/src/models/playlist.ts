import { InferSchemaType, Schema, model } from "mongoose";

const IconSchema = new Schema({
  height: { type: Number, default: 60 },
  width: { type: Number, default: 60 },
  url: { type: String, required: true },
  public_id: { type: String, default: "" },
});

const PlaylistSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: {
    type: String,
    minLength: 3,
    maxLength: 80,
    required: true,
    unique: true,
  },
  isPublic: { type: Boolean, default: false },
  songs: { type: [String], default: [] },
  duration: { type: Number, default: 0 },
  images: {
    type: [IconSchema],
    default: {
      public_id: "",
      height: 60,
      width: 60,
      url: "https://i.ibb.co/vB2GsrM/default-playlist.png",
    },
  },
});

type Playlist = InferSchemaType<typeof PlaylistSchema>;
export default model<Playlist>("Playlist", PlaylistSchema);
