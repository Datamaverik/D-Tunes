import styles from "../components/styles/Genre.module.css";
import PlaylistView from "../components/PlaylistView";
import * as UserApi from "../network/api";
import { useEffect, useState } from "react";
import SongPlayer from "../components/SongPlayer";
import { fetchedTrack } from "../pages/Profile";
import * as spotifyApi from "../network/spotify";
import * as trackApi from "../network/tracks";
import { isValidMongoObjectID } from "../utils/monogIdvalidator";

export interface artistDistModel {
  artist: string;
  percentage: number;
}

export interface explicitModel {
  field: string;
  percentage: number;
}

interface TrackHistoryListProps {
  showSongPlayer: boolean;
  onArtistUpdate: (artistDist: artistDistModel[]) => void;
  onExplicitUpdate: (explicitData: explicitModel[]) => void;
  togglePlayer:()=>void;
}

const TrackHistoryList = ({
  showSongPlayer,
  onArtistUpdate,
  onExplicitUpdate,
  togglePlayer
}: TrackHistoryListProps) => {
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
      const songs: fetchedTrack[] = await Promise.all(songPromises);
      setTracks(songs);
      calculateArtistDistribution(songs);
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

  const calculateArtistDistribution = (songs: fetchedTrack[]) => {
    const artistCount: { [key: string]: number } = {};
    const explicitCount = { Explicit: 0, NonExplicit: 0 };

    songs.forEach((song) => {
      if (artistCount[song.artists[0].name]) {
        artistCount[song.artists[0].name]++;
      } else {
        artistCount[song.artists[0].name] = 1;
      }
      if (song.explicit) explicitCount.Explicit++;
      else explicitCount.NonExplicit++;
    });
    const totalSongs = songs.length;
    const artistDistribution: artistDistModel[] = Object.keys(artistCount).map(
      (artist) => ({
        artist,
        percentage: (artistCount[artist] / totalSongs) * 100,
      })
    );
    const explicitDistribution: explicitModel[] = [
      {
        field: "Explicit Songs",
        percentage: (explicitCount.Explicit / totalSongs) * 100,
      },
      {
        field: "Non Explicit Songs",
        percentage: (explicitCount.NonExplicit / totalSongs) * 100,
      },
    ];
    onExplicitUpdate(explicitDistribution);
    onArtistUpdate(artistDistribution);
  };

  useEffect(() => {
    getLikedSongs();
    getTrackHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.trackCont}>
      <div style={{ marginBottom: "-10px" }} className={styles.playlistView}>
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
                togglePlayer();
              }}
              key={index}
              name={track.name}
              icon={track.album.images[0]}
            />
          ))}
      </div>
      {showSongPlayer && <SongPlayer id={trackId} songs={tracks} />}
    </div>
  );
};

export default TrackHistoryList;
