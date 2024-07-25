import styles from "../components/styles/Genre.module.css";
import PlaylistView from "../components/PlaylistView";
import * as UserApi from "../network/api";
import { useEffect, useState } from "react";
import SongPlayer from "../components/SongPlayer";
import { fetchedTrack } from "../pages/Profile";
import * as spotifyApi from "../network/spotify";
import * as trackApi from "../network/tracks";
import { isValidMongoObjectID } from "../utils/monogIdvalidator";

const TrackHistoryList = () => {
  //   const tracks: Track[] = track;
  const [tracks, setTracks] = useState<fetchedTrack[]>([]);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);

  async function getLikedSongs() {
    try {
      const response = await UserApi.getLikedSongs();
      setLikedSongs(response);
    } catch (er) {
      console.error(er);
    }
  }

  async function getTrackHistory() {
    try {
      const user = await UserApi.getLoggedInUser();
      const trackIdArr = user.user.trackHistory;
      const songPromises = trackIdArr.map((song: string) => {
        if (isValidMongoObjectID(song)) return trackApi.getTrackByID(song);
        else return spotifyApi.getTrack(song);
      });
      const songs = await Promise.all(songPromises);
      setTracks(songs);
    } catch (er) {
      console.error(er);
    }
  }

  async function updateTrack(trackId: string) {
    try {
      await UserApi.pushTrack(trackId);
    } catch (er) {
      console.error(er);
    }
  }

  useEffect(() => {
    getLikedSongs();
    getTrackHistory();
    console.log(tracks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.trackCont} style={{ position: "relative",height:"30vh" }}>
      <div style={{marginBottom:"-10px"}} className={styles.playlistView}>
        {tracks &&
          tracks.map((track, index) => (
            <PlaylistView
              artist={track.artists[0].name}
              duration={track.duration_ms}
              songId={track.id}
              isLiked={likedSongs.includes(track.id)}
              onClick={() => {
                setTrackId(track.id);
                updateTrack(track.id);
              }}
              key={index}
              name={track.name}
              icon={track.album.images[0]}
            />
          ))}
      </div>
      <SongPlayer id={trackId} songs={tracks} />
    </div>
  );
};

export default TrackHistoryList;
