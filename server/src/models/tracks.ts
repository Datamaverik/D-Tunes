import { InferSchemaType, Schema, model } from "mongoose";
import { deflate } from "zlib";

const IconSchema = new Schema({
  height: { type: Number, default: 60 },
  width: { type: Number, default: 60 },
  url: { type: String, required: true },
  public_id: { type: String, default: "" },
});

const AlbumSchema = new Schema({
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

const TrackSchema = new Schema(
  {
    artist: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: {
      type: String,
      minLength: 3,
      maxLength: 80,
      required: true,
    },
    preview_url: { type: String, default: "" },
    duration_ms: { type: Number, default: 0 },
    album: { type: AlbumSchema },
    public_id: { type: String, default: "" },
    genre: { type: String, required: true },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

type Track = InferSchemaType<typeof TrackSchema>;
export default model<Track>("Track", TrackSchema);
