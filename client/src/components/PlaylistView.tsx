import { icons } from "../models/icons";
import styles from '../components/styles/Genre.module.css'

interface playlistViewProps {
  icon: icons;
  name: string;
  onClick: () => void;
}

const PlaylistView = ({icon,name,onClick}:playlistViewProps) => {
  return (
    <div className={styles.songCont}>
      <div
        className={styles.songImgCont}
        style={{ backgroundImage: `url(${icon.url})` }}
      ></div>
      <div className={styles.songName}>
        <p onClick={onClick}>{name}</p>
        <img src="../public/notLiked.svg" alt="" />
      </div>
    </div>
  );
};

export default PlaylistView;
