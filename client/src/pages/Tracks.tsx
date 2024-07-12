import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as SpotifyApi from "../network/spotify";
import { playlistsByGenre } from "../models/playlistsByGenre";
import styles from '../components/styles/Genre.module.css'
import GenreCard from "../components/GenreCard";

interface PlaylistProps {
  onClick: (id: string) => void;
}

const Tracks = ({onClick}:PlaylistProps) => {
  const { id } = useParams<{ id: string }>();

  const [playlists, setPlaylists]=useState<playlistsByGenre[]|null>(null);

  async function getGenrePlaylists() {
    try {
      if(!id)return;
      else{
        const response = await SpotifyApi.getPlaylists(id);
        setPlaylists(response);
      }
    } catch (er) {
      console.error(er);
    }
  }

  useEffect(() => {
    getGenrePlaylists();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleClick(id: string) {
    onClick(id);
  }

  return (
    <div className={styles.genreCardCont}>
      {playlists &&
        playlists.map((playlist, ind) => (
          <GenreCard
            onClick={() => {handleClick(playlist.id)}}
            key={ind}
            name={''}
            icon={playlist.images[0]}
          />
        ))}
    </div>
  );
};

export default Tracks;
