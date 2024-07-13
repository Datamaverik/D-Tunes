import * as SpotifyApi from "../network/spotify";
import { useEffect, useState } from "react";
import styles from "../components/styles/Genre.module.css";
import { Track } from "../models/SpotifyTrack";

interface TrackPlayerProps {
  id: string | null;
  songs: Track[];
}

const TrackPlayer = ({ id, songs }: TrackPlayerProps) => {
  const audioElement = document.getElementById(
    "audio-preview"
  ) as HTMLAudioElement;
  const [tracks, setTracks] = useState<Track[]>(songs);
  const [audio, setAudio] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track>();

  async function getChosenTrack() {
    try {
      if (!id) return;
      const response = await SpotifyApi.getTrack(id);
      setAudio(response.preview_url);
    } catch (er) {
      console.error(er);
    }
  }

  //   async function getPlaylistsTracks() {
  //     try {
  //       if (!playlistId) return;
  //       else {
  //         const response = await SpotifyApi.getTracksOfPlaylist(playlistId);
  //         setTracks(response);
  //       }
  //     } catch (er) {
  //       console.error(er);
  //     }
  //   }

  useEffect(() => {
    getChosenTrack();
    setTracks(songs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs]);

  useEffect(() => {
    if (tracks.length > 0) {
      const track = tracks.find((track) => track.id === id);
      setCurrentTrack(track);
      if (track) {
        if (!track.preview_url) playNextSong(track);
        else setAudio(track.preview_url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (audio && audioElement) {
      audioElement.src = audio;
      audioElement.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  const playNextSong = (currTrack?: Track) => {
    if (!currentTrack) return;
    let ind = tracks.indexOf(currentTrack);
    if (currTrack) ind = tracks.indexOf(currTrack);
    ind += 1;
    if (ind >= tracks.length) ind = 0;
    let nextTrack = tracks[ind];
    if (!nextTrack.preview_url) ind += 1;
    if (ind >= tracks.length) ind = 0;
    nextTrack = tracks[ind];
    setCurrentTrack(nextTrack);
    setAudio(nextTrack.preview_url);
  };

  const handleEnd = () => {
    playNextSong();
  };

  return (
    <div className={styles.trackPlayer}>
      <figure className={styles.playerCont}>
        <figcaption className={styles.caption}>{currentTrack?.name}</figcaption>
        <audio
          controls
          id="audio-preview"
          onEnded={handleEnd}
          autoPlay={false}
        />
      </figure>
    </div>
  );
};

export default TrackPlayer;
