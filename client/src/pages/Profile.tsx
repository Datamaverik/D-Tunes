import { useEffect, useRef, useState } from "react";
import styles from "../components/styles/profile.module.css";
import styles2 from "../components/styles/Sidebar.module.css";
import styles3 from "../components/styles/form.module.css";
import * as userApi from "../network/api";
import * as trackApi from "../network/tracks";
import * as UserApi from "../network/api";
import useToast from "../CustomHooks/Toast.hook";
import { FieldError, useForm } from "react-hook-form";
import TextInputField from "../components/form/TextInputField";
import PlaylistView from "../components/PlaylistView";
import SongPlayer from "../components/SongPlayer";
import { Track } from "../models/SpotifyTrack";

export interface FetchedUser {
  _id: string;
  username: string;
  email: string;
  isArtist: boolean;
  password: string;
}

interface ProfileProps {
  isArtist: boolean;
  user: FetchedUser | null;
}
export interface songInput {
  name: string;
  duration_ms: string;
  image: FileList;
  song: FileList;
  genre: string;
}

export interface fetchedTrack extends Track {
  _id: string;
}

const Profile = ({ isArtist, user }: ProfileProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<songInput>();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // const [currentUser, setCurrentUser] = useState<FetchedUser | null>(null);
  const [duration_ms, setDuration] = useState<number>(0);
  const [tracks, setTracks] = useState<fetchedTrack[]>([]);
  const [trackId, setTrackId] = useState<string>("");
  // const [showLikedSongs, setShowLikedSongs] = useState<boolean>(false);

  const { showToast } = useToast();

  const [likedSongs, setLikedSongs] = useState<string[]>([]);

  async function getLikedSongs() {
    try {
      const response = await UserApi.getLikedSongs();
      setLikedSongs(response);
    } catch (er) {
      console.error(er);
    }
  }

  const onSubmit = async (credentials: songInput) => {
    dialogRef.current?.close();
    try {
      const reader = new FileReader();
      console.log(reader);

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const audioContext = new window.AudioContext();
          const arrayBuffer = e.target.result as ArrayBuffer;
          audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            const duration = buffer.duration;
            setDuration(Math.floor(duration * 1000));
          });
          reader.readAsArrayBuffer(credentials.song[0]);
        } else {
          console.error("Failed to read the audio file");
          showToast("Failed to read the audion file", "failure");
        }
      };
      console.log(duration_ms);
      const trackInput: trackApi.trackInput = {
        name: credentials.name,
        duration_ms: duration_ms.toString(),
        image: credentials.image[0],
        song: credentials.song[0],
        genre: credentials.genre,
      };
      console.log(trackInput);
      const savedTrack = await trackApi.saveTrack(trackInput);
      console.log(savedTrack);
      showToast("Track uploaded successfully", "success");
      getPublishedTracks();
    } catch (er) {
      console.error(er);
      if (er instanceof Error) showToast(er.message, "failure");
    }
  };

  const handleClick = async () => {
    try {
      let res;
      if (user)
        res = await userApi.updateUser(user._id, {
          isArtist: true,
        });
      console.log(res);
    } catch (error) {
      if (error instanceof Error) showToast(error.message, "warning");
    }
  };

  const handleAdd = () => {
    dialogRef.current?.showModal();
  };

  const getPublishedTracks = async () => {
    try {
      if (!user) return;
      const response = await trackApi.getTrackByUser(user._id);
      setTracks(response);
    } catch (er) {
      if (er instanceof Error) showToast(er.message, "warning");
    }
  };

  useEffect(() => {
    getLikedSongs();
    getPublishedTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <dialog ref={dialogRef} className={styles2.dialogCont}>
        <button
          className={styles2.closeBtn}
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          X
        </button>
        <form
          action="post"
          encType="multipart/form-data"
          className={styles2.formGroup}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputField
            name="image"
            label="Submit a thumbnail"
            type="file"
            register={register}
            error={errors.image as FieldError}
          />
          <TextInputField
            name="song"
            label="Submit the track"
            type="file"
            register={register}
            error={errors.song as FieldError}
          />
          <TextInputField
            name="name"
            label="Name of Track"
            type="text"
            placeholder="Name"
            register={register}
            registerOptions={{
              required: "required",
              minLength: 3,
              maxLength: 255,
            }}
            error={errors.name as FieldError}
          />
          <div className={styles3.textGroup}>
            <label htmlFor="genre" className={styles3.formLabel}>
              Genre
            </label>
            <select
              id="genre"
              className={`${styles3.inputArea} ${
                errors.genre ? styles3.invalid : ""
              }`}
              {...register("genre", { required: "Genre is required" })}
            >
              <option value="">Select a Genre</option>
              <option value="pop">Pop</option>
              <option value="hindi">Hindi</option>
              <option value="punjabi">Punjabi</option>
              <option value="tamil">Tamil</option>
              <option value="ghazals">Ghazals</option>
              <option value="telugu">Telugu</option>
              <option value="malayalam">Malayalam</option>
              <option value="bhojpuri">Bhojpuri</option>
              <option value="sommar">Sommar</option>
              <option value="indie">Indie</option>
              <option value="party">Party</option>
              <option value="devotionaly">Devotional</option>
            </select>
          </div>
          <div>
            <button type="submit" className={styles2.signUpBtn}>
              Create
            </button>
          </div>
        </form>
      </dialog>
      <div className={styles.profilePage}>
        <div className={styles.profileSec}>
          Profile Image
          {!user?.isArtist && (
            <button className={styles.upgradeBtn} onClick={handleClick}>
              Upgrade to Artist
            </button>
          )}
        </div>
        <div className={styles.topAlbumSec}>Top albums</div>
        <div className={styles.topTrackSec}>Top tracks</div>
        <div className={styles.friendsSection}>Friends</div>
        {isArtist && (
          <>
            <div style={{ position: "relative" }}>
              <p style={{ marginLeft: "50%", transform: "translateX(-25%)" }}>
                Published Tracks
              </p>
              <div className={styles.playlistView}>
                {tracks &&
                  tracks.map((track, index) => (
                    <PlaylistView
                      songId={track.id}
                      isLiked={likedSongs.includes(track.id)}
                      onClick={() => {
                        setTrackId(track.id);
                      }}
                      key={index}
                      name={track.name}
                      icon={track.album.images[0]}
                    />
                  ))}
              </div>
              <SongPlayer id={trackId} songs={tracks} />
            </div>
            <div className={styles.addSongs}>
              <button onClick={handleAdd}>Publish Track</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
