import { icons } from "../models/icons";
import styles from "../components/styles/Genre.module.css";
import * as UserApi from "../network/api";
import { useState } from "react";

interface PlaylistViewProps {
  icon: icons;
  name: string;
  onClick: () => void;
  isLiked: boolean;
  songId: string;
}

const PlaylistView = ({
  icon,
  name,
  onClick,
  isLiked,
  songId,
}: PlaylistViewProps) => {
  const [imgSrc, setImgSrc] = useState<string>(
    isLiked ? "../public/liked.svg" : "../public/notLiked.svg"
  );

  async function handleClick(id: string) {
    const songObj = {
      songId: id,
    };

    setImgSrc((prevSrc) =>
      prevSrc === "../public/liked.svg"
        ? "../public/notLiked.svg"
        : "../public/liked.svg"
    );

    try {
      await UserApi.toggleLike(songObj);
    } catch (er) {
      console.error(er);
      // Revert the imgSrc state if the API call fails
      setImgSrc((prevSrc) =>
        prevSrc === "../public/liked.svg"
          ? "../public/notLiked.svg"
          : "../public/liked.svg"
      );
    }
  }

  return (
    <div className={styles.songCont}>
      <div
        className={styles.songImgCont}
        style={{ backgroundImage: `url(${icon.url})` }}
      ></div>
      <div className={styles.songName}>
        <p onClick={onClick}>{name}</p>
        <img
          id={`likeLogo-${songId}`} // Use a unique id
          onClick={() => handleClick(songId)}
          src={imgSrc}
          alt=""
        />
      </div>
    </div>
  );
};

export default PlaylistView;
