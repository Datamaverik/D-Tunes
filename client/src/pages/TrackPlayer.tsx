import * as SpotifyApi from "../network/spotify";
import { useEffect, useState } from "react";
import styles from "../components/styles/Genre.module.css";
import { TracksInPlaylist } from "../models/TracksInPlaylist";
import * as PlaylistApi from "../network/playlist";
import { fetchedPlaylistModel } from "../components/Sidebar";

interface TrackPlayerProps {
  id: string | null;
  playlistId: string | null;
}

const TrackPlayer = ({ id, playlistId }: TrackPlayerProps) => {
  const audioElement = document.getElementById(
    "audio-preview"
  ) as HTMLAudioElement;
  const [tracks, setTracks] = useState<TracksInPlaylist[]>([]);
  const [audio, setAudio] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TracksInPlaylist>();
  const [showDropdown, setShowDropDown] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<fetchedPlaylistModel[]>([]);

  // async function getChosenTrack() {
  //   try {
  //     if (!id) return;
  //     const response = await SpotifyApi.getTrack(id);
  //     setAudio(response.preview_url);
  //     console.log(response);
  //   } catch (er) {
  //     console.error(er);
  //   }
  // }

  async function getPlaylistsTracks() {
    try {
      if (!playlistId) return;
      else {
        const response = await SpotifyApi.getTracksOfPlaylist(playlistId);
        setTracks(response);
      }
    } catch (er) {
      console.error(er);
    }
  }

  async function fetchPlaylists() {
    try {
      const res = await PlaylistApi.getAllUserPlaylists();
      setPlaylists(res);
    } catch (er) {
      console.error(er);
    }
  }

  useEffect(() => {
    getPlaylistsTracks();
    fetchPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tracks.length > 0) {
      const track = tracks.find((track) => track.track.id === id);
      setCurrentTrack(track);
      if (track) {
        if (!track.track.preview_url) playNextSong(track);
        else setAudio(track.track.preview_url);
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

  const playNextSong = (currTrack?: TracksInPlaylist) => {
    if (!currentTrack) return;
    let ind = tracks.indexOf(currentTrack);
    if (currTrack) ind = tracks.indexOf(currTrack);
    ind += 1;
    if (ind >= tracks.length) ind = 0;
    let nextTrack = tracks[ind];
    if (!nextTrack.track.preview_url) ind += 1;
    if (ind >= tracks.length) ind = 0;
    nextTrack = tracks[ind];
    setCurrentTrack(nextTrack);
    setAudio(nextTrack.track.preview_url);
  };

  const handleAddSong = async (playlistId: string) => {
    try {
      if (!currentTrack) return;
      const response = await PlaylistApi.addRemPlaylist(
        playlistId,
        currentTrack.track.id,
        currentTrack.track.duration_ms / 1000
      );
      alert("Song added to playlist");
      console.log(response);
    } catch (er) {
      console.error(er);
    }
  };

  const handleEnd = () => {
    playNextSong();
  };

  return (
    <div className={styles.trackPlayer}>
      {showDropdown && (
        <div className={styles.dropDown}>
          {playlists.map((playlist, ind) => (
            <div
              className={styles.dropDownItems}
              key={ind}
              onClick={() => handleAddSong(playlist._id)}
            >
              {playlist.name}
            </div>
          ))}
        </div>
      )}
      <figure className={styles.playerCont}>
        <figcaption className={styles.caption}>
          {currentTrack?.track.name}
        </figcaption>
        <div className={styles.audioCont}>
          <audio
            className={styles.audioPreview}
            controls
            id="audio-preview"
            onEnded={handleEnd}
            autoPlay={false}
          />
          <button
            onClick={() => setShowDropDown(!showDropdown)}
            className={styles.addBtn}
          >
            <img
              className={styles.addImg}
              src="../../public/addIcon.svg"
              alt=""
            />
          </button>
        </div>
      </figure>
    </div>
  );
};

export default TrackPlayer;
