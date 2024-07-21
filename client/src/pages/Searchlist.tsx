import { useLocation } from "react-router-dom";
import styles from "../components/styles/Genre.module.css";
import { Track } from "../models/SpotifyTrack";
import PlaylistView from "../components/PlaylistView";
import * as UserApi from "../network/api";
import { useEffect, useState } from "react";
import SongPlayer from "../components/SongPlayer";

const Searchlist = () => {
  const { state } = useLocation();
  const tracks: Track[] = state.track;
  const [trackId, setTrackId] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);

  async function getLikedSongs() {
    try {
      const response = await UserApi.getLikedSongs();
      setLikedSongs(response);
    } catch (er) {
      console.error(er);
    }
  }

  useEffect(() => {
    getLikedSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <div className={styles.trackCont} style={{ position: "relative" }}>
      <div className={styles.playlistView}>
        {tracks &&
          tracks.map((track, index) => (
            <PlaylistView
            duration={track.duration_ms}
              songId={track.id}
              isLiked={likedSongs.includes(track.id)}
              onClick={() => {
                setTrackId(track.id);
              }}
              key={index}
              name={track.name}
              icon={track.album.images[0]}
            />
          ))}
      </div>
      <SongPlayer id={trackId} songs={state.track} />
    </div>
  );
};

export default Searchlist;
