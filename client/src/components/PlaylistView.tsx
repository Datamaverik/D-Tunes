import { icons } from "../models/icons";
import styles from "../components/styles/Genre.module.css";
import * as UserApi from "../network/api";
import { useEffect, useState } from "react";

interface PlaylistViewProps {
  icon: icons;
  name: string;
  onClick: () => void;
  isLiked: boolean;
  songId: string;
  duration: number;
  artist: string;
}

const PlaylistView = ({
  icon,
  name,
  onClick,
  isLiked,
  songId,
  duration,
  artist,
}: PlaylistViewProps) => {
  const [imgSrc, setImgSrc] = useState<string>(
    isLiked ? "../public/liked.svg" : "../public/notLiked.svg"
  );

  const formatTime = (dur: number) => {
    let seconds = Math.floor(dur / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 1000);
    seconds = Math.floor(seconds % 60);
    const paddedSec = seconds.toString().padStart(2, "0");
    const paddedMin = minutes.toString().padStart(2, "0");
    return hours
      ? `${hours}:${paddedMin}:${paddedSec}`
      : minutes
      ? `${minutes}:${paddedSec}`
      : `${paddedSec}`;
  };

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
      const response = await UserApi.toggleLike(songObj);
      console.log(response);
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

  useEffect(() => {
    setImgSrc(isLiked ? "../public/liked.svg" : "../public/notLiked.svg");
  }, [isLiked]);

  return (
    <div className={styles.songCont}>
      <div
        className={styles.songImgCont}
        style={{ backgroundImage: `url(${icon.url})` }}
      ></div>
      <div className={styles.songName}>
        <div>
          <p onClick={onClick}>{name}</p>
          <p className={styles.artistName}>{artist}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <img
            className={styles.likeLogo}
            id={`likeLogo-${songId}`} // Use a unique id
            onClick={() => handleClick(songId)}
            src={imgSrc}
            alt=""
          />
          <p className={styles.duration}>{formatTime(duration)}</p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
