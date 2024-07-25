import { useEffect, useState } from "react";
import * as PlaylistApi from "../network/playlist";
import * as spotifyApi from "../network/spotify";
import styles from "../components/styles/Genre.module.css";
import GenreCard from "../components/GenreCard";
import { useNavigate } from "react-router-dom";
import { fetchedPlaylistModel } from "../components/Sidebar";

const UserTracks = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<fetchedPlaylistModel[]>([]);

  async function getAllUserPlaylists() {
    try {
      const response = await PlaylistApi.getAllPublicPlaylists();
      setPlaylists(response);
    } catch (er) {
      console.error(er);
    }
  }
  useEffect(() => {
    getAllUserPlaylists();
  }, []);

  const handleClick = async (playlistId: string) => {
    try {
      const playlist: fetchedPlaylistModel = await PlaylistApi.getPlaylistById(
        playlistId
      );
      const songPromises = playlist.songs.map((song: string) =>
        spotifyApi.getTrack(song)
      );
      const songs = await Promise.all(songPromises);
      navigate("/serachlist", { state: { track: songs } });
    } catch (er) {
      console.error(er);
    }
  };

  return (
    <div className={styles.genreCardCont}>
      {playlists &&
        playlists.map((playlist, ind) => (
          <GenreCard
            onClick={() => {
              handleClick(playlist._id);
            }}
            key={ind}
            name={playlist.name}
            icon={playlist.images[0]}
          />
        ))}
    </div>
  );
};

export default UserTracks;
