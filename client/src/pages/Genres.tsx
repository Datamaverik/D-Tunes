import { useEffect, useState } from "react";
import * as SpotifyApi from "../network/spotify";
import { genres } from "../models/genres";
import GenreCard from "../components/GenreCard";
import styles from "../components/styles/Genre.module.css";
import { useNavigate } from "react-router-dom";

interface GenreProps {
  onClick: (id: string) => void;
}

const Genres = ({ onClick }: GenreProps) => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<genres[] | null>(null);

  async function getingGenres() {
    try {
      const genres = await SpotifyApi.getGenres();
      setGenres(genres);
    } catch (er) {
      console.error(er);
    }
  }

  useEffect(() => {
    getingGenres();
  }, []);

  function handleClick(id: string) {
    onClick(id);
  }
  return (
    <div className={styles.genreCardCont}>
      <GenreCard
        key={"userCreatedPlaylist"}
        name={"users Playlist"}
        icon={{
          height: 60,
          width: 60,
          url: "https://t.scdn.co/images/728ed47fc1674feb95f7ac20236eb6d7.jpeg",
        }}
        onClick={() => {
          navigate("/userTracks");
        }}
      />
      {genres &&
        genres.map((genre, index) => (
          <GenreCard
            onClick={() => handleClick(genre.id)}
            key={index}
            name={genre.name}
            icon={genre.icons[0]}
          />
        ))}
    </div>
  );
};

export default Genres;
