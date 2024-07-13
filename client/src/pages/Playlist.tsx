import { useParams } from "react-router-dom";
import * as SpotifyApi from "../network/spotify";
import * as UserApi from "../network/api";
import { useEffect, useState } from "react";
import { TracksInPlaylist } from "../models/TracksInPlaylist";
import styles from "../components/styles/Genre.module.css";
import PlaylistView from "../components/PlaylistView";
import TrackPlayer from "./TrackPlayer";

const Playlist = () => {
  const { id } = useParams<{ id: string }>();
  const [tracks, setTracks] = useState<TracksInPlaylist[] | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);

  async function getPlaylistsTracks() {
    try {
      if (!id) return;
      else {
        const response = await SpotifyApi.getTracksOfPlaylist(id);
        setTracks(response);
      }
    } catch (er) {
      console.log("error from here");
      console.error(er);
    }
  }

  async function getLikedSongs() {
    try {
      const response = await UserApi.getLikedSongs();
      setLikedSongs(response);
      // console.log(response);
    } catch (er) {
      console.error(er);
    }
  }

  useEffect(() => {
    getPlaylistsTracks();
    getLikedSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div style={{ position: "relative" }}>
      <div className={styles.playlistView}>
        {tracks &&
          tracks.map((track, index) => (
            <PlaylistView
              songId={track.track.id}
              isLiked={likedSongs.includes(track.track.id)}
              onClick={() => {
                setTrackId(track.track.id);
              }}
              key={index}
              name={track.track.name}
              icon={track.track.album.images[0]}
            />
          ))}
      </div>
      <TrackPlayer id={trackId} playlistId={id!} />
    </div>
  );
};

export default Playlist;
