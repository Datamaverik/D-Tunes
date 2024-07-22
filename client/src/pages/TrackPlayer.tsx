import * as SpotifyApi from "../network/spotify";
import { useEffect, useRef, useState } from "react";
import styles from "../components/styles/Genre.module.css";
import { TracksInPlaylist } from "../models/TracksInPlaylist";
import * as PlaylistApi from "../network/playlist";
import * as TrackApi from "../network/tracks";
import { fetchedPlaylistModel } from "../components/Sidebar";
import useToast from "../CustomHooks/Toast.hook";

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
  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const [playlists, setPlaylists] = useState<fetchedPlaylistModel[]>([]);
  const [lyrics, setLyrics] = useState<string[]>([""]);
  const { showToast } = useToast();

  const addBtn = useRef<HTMLButtonElement | null>(null);
  const lyricsBtn = useRef<HTMLButtonElement | null>(null);
  const dropDown = useRef<HTMLDivElement | null>(null);

  async function getPlaylistsTracks() {
    try {
      if (!playlistId) return;
      else {
        const response = await SpotifyApi.getTracksOfPlaylist(playlistId);
        setTracks(response);
        setShowDropDown(false);
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

  async function fetchLyrics(title: string, artist: string) {
    try {
      const lyrics = await TrackApi.getLyrics({
        title,
        artist,
      });
      console.log(lyrics);
      const lines: string[] = lyrics.split("\n");
      setLyrics(lines);
    } catch (er) {
      console.error(er);
    }
  }

  useEffect(() => {
    getPlaylistsTracks();
    fetchPlaylists();
    setShowDropDown(false);
    setShowLyrics(false);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDown.current &&
        !dropDown.current.contains(event.target as Node) &&
        addBtn.current &&
        !addBtn.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tracks.length > 0) {
      const track = tracks.find((track) => track.track.id === id);
      setCurrentTrack(track);
      if (track) fetchLyrics(track.track.name, track?.track.artists[0].name);
      console.log(track);
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
    fetchLyrics(nextTrack.track.name, nextTrack.track.artists[0].name);
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
      if (response?.status === 201) showToast(response.data.message, "failure");
      else showToast(response?.data.message, "success");
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
        <div className={styles.dropDown} ref={dropDown}>
          {playlists.map((playlist, ind) => (
            <div
              className={`${styles.dropDownItems}`}
              key={ind}
              onClick={() => handleAddSong(playlist._id)}
            >
              {playlist.name}
            </div>
          ))}
        </div>
      )}
      {showLyrics && (
        <div className={styles.lyricsCont}>
          {lyrics.map((line, index) => (
            <p key={index} className={styles.lyrics}>
              {line}
            </p>
          ))}
        </div>
      )}
      <figure className={styles.playerCont}>
        <figcaption className={styles.caption}>
          {currentTrack?.track.name}
        </figcaption>
        <div className={styles.audioCont}>
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            ref={lyricsBtn}
            className={styles.addBtn}
          >
            <img
              className={styles.addImg}
              src="../../public/lyrics.svg"
              alt=""
            />
          </button>
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
            ref={addBtn}
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
