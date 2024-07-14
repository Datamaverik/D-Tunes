import { useEffect, useState } from "react";
import styles from "../components/styles/Sidebar.module.css";
import * as userApi from "../network/api";
import * as spotifyApi from "../network/spotify";
import { useNavigate } from "react-router-dom";
import { Track } from "../models/SpotifyTrack";

const LikedSongs = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [formatedTime, setFormattedTime] = useState<string>("0sec");
  const navigate = useNavigate();

  const formatTime = (time: number): void => {
    const minutes = time / 60;
    const hours = Math.floor(minutes / 60);
    const RemSeconds = Math.floor(time % 60);
    const remMin = Math.floor(minutes % 60);
    setFormattedTime(
      remMin
        ? hours
          ? `${hours}hr ${remMin}min ${RemSeconds}sec`
          : `${remMin}min ${RemSeconds}sec`
        : `${RemSeconds}sec`
    );
  };

  const handleClick = () => {
    navigate("/serachlist", { state: { track: tracks } });
  };

  const fetchSongs = async () => {
    try {
      const playlist: string[] = await userApi.getLikedSongs();
      const songPromises = playlist.map((song: string) =>
        spotifyApi.getTrack(song)
      );
      const songs = await Promise.all(songPromises);
      let duration: number = 0;
      songs.map((song: Track) => {
        duration += song.duration_ms / 1000;
      });
      formatTime(duration);
      setTracks(songs);
    } catch (er) {
      console.error(er);
    }
  };
  useEffect(() => {
    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.playlistCont}>
      <div
        onClick={handleClick}
        style={{ display: "flex", alignItems: "center" }}
      >
        <img
          className={styles.playlistImg}
          src={"../public/likedSongs-banner.jpg"}
          alt=""
        />
        <div className={styles.playlistTitle}>
          <div className={styles.playlistName}>Liked Songs</div>
          <div className={styles.playlistDur}>
            Duration: {formatedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikedSongs;
