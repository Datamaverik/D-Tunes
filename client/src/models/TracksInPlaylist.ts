import { Track } from "./SpotifyTrack";

export interface TracksInPlaylist {
  track: Track;
  video_thumbnail: {
    url: string | null;
  };
}
