import { icons } from "../models/icons";
import styles from "../components/styles/Sidebar.module.css";
import * as playlistApi from "../network/playlist";
import * as spotifyApi from "../network/spotify";
import * as trackApi from "../network/tracks";
import { useNavigate } from "react-router-dom";
import { isValidMongoObjectID } from "../utils/monogIdvalidator";

interface userPlaylistsProps {
  name: string;
  totalDuration: number;
  image: icons;
  playlistId: string;
  onDelete: (id: string) => void;
}

const UserPlaylists = ({
  name,
  totalDuration,
  image,
  onDelete,
  playlistId,
}: userPlaylistsProps) => {
  const navigate = useNavigate();
  const formatTime = (time: number): string => {
    const minutes = time / 60;
    const hours = Math.floor(minutes / 60);
    const RemSeconds = Math.floor(time % 60);
    const remMin = Math.floor(minutes % 60);
    return remMin
      ? hours
        ? `${hours}hr ${remMin}min ${RemSeconds}sec`
        : `${remMin}min ${RemSeconds}sec`
      : `${RemSeconds}sec`;
  };

  const handleClick = async () => {
    try {
      const playlist: playlistApi.playlistCredentials =
        await playlistApi.getPlaylistById(playlistId);
      const songPromises = playlist.songs.map((song: string) => {
        if (isValidMongoObjectID(song)) return trackApi.getTrackByID(song);
        else return spotifyApi.getTrack(song);
      });
      const songs = await Promise.all(songPromises);
      navigate("/serachlist", { state: { track: songs } });
    } catch (er) {
      console.error(er);
    }
  };

  return (
    <div className={styles.playlistCont}>
      <div
        onClick={handleClick}
        style={{ display: "flex", alignItems: "center" }}
      >
        <img className={styles.playlistImg} src={image.url} alt="" />
        <div className={styles.playlistTitle}>
          <div className={styles.playlistName}>{name}</div>
          <div className={styles.playlistDur}>
            Duration: {formatTime(totalDuration)}
          </div>
        </div>
      </div>
      <button onClick={() => onDelete(playlistId)} className={styles.iconBtn}>
        <img className={styles.icons} src="../public/deleteIcon.svg" alt="" />
      </button>
    </div>
  );
};

export default UserPlaylists;
