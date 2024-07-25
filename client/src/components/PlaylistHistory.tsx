import { useEffect, useState } from "react";
import * as UserApi from "../network/api";
import * as SpotifyApi from "../network/spotify";
import { playlistsByGenre } from "../models/playlistsByGenre";
import styles from "../components/styles/Genre.module.css";
import GenreCard from "../components/GenreCard";
import { useNavigate } from "react-router-dom";

const PlaylistHistory = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<playlistsByGenre[] | null>(null);

  async function getGenrePlaylists() {
    try {
      const user = await UserApi.getLoggedInUser();
      const playlistIdArr = user.user.albumHistory;
      const playlistPromises = playlistIdArr.map((playlistId: string) => {
        return SpotifyApi.getPlaylistById(playlistId);
      });
      const playlistArr = await Promise.all(playlistPromises);
      setPlaylists(playlistArr);
    } catch (er) {
      console.error(er);
    }
  }
  

  async function pushPlaylist(playlistId: string) {
    try {
      await UserApi.pushPlaylist(playlistId);
    } catch (er) {
      console.error(er);
    }
  }

  useEffect(() => {
    getGenrePlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(id: string) {
    navigate(`/playlist/${id}`);
  }

  return (
    <div className={styles.genreCardCont}>
      {playlists &&
        playlists.map((playlist, ind) => (
          <GenreCard
            onClick={() => {
              handleClick(playlist.id);
              pushPlaylist(playlist.id);
            }}
            key={ind}
            name={""}
            icon={playlist.images[0]}
          />
        ))}
    </div>
  );
};

export default PlaylistHistory;
