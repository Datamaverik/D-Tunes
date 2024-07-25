import { FormEvent, useEffect, useRef, useState } from "react";
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
import FriendList from "./FriendList";
import TrackHistoryList from "../components/TrackHistoryList";
import PlaylistHistory from "../components/PlaylistHistory";

export interface FetchedUser {
  _id: string;
  username: string;
  email: string;
  isArtist: boolean;
  password: string;
  profileImgURL: string;
  public_id: string;
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

const Profile = ({ user }: ProfileProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<songInput>();

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const pfpDialogRef = useRef<HTMLDialogElement | null>(null);
  const pfpSubBtnRef = useRef<HTMLButtonElement | null>(null);
  const pfpFileRef = useRef<HTMLInputElement | null>(null);
  const pfpEmailRef = useRef<HTMLInputElement | null>(null);

  const [currentUser, setCurrentUser] = useState<FetchedUser>(user!);
  // const [isartist, setIsArtist] = useState<boolean>(isArtist);
  const [tracks, setTracks] = useState<fetchedTrack[]>([]);
  const [trackId, setTrackId] = useState<string>("");
  const [showFrinds, setShowFriends] = useState<boolean>(false);
  const [showFrindReq, setShowFriendReq] = useState<boolean>(false);
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
      let duration_ms: number = 0;
      reader.onload = async (e) => {
        if (e.target && e.target.result) {
          const audioContext = new window.AudioContext();
          const arrayBuffer = e.target.result as ArrayBuffer;
          await audioContext.decodeAudioData(arrayBuffer, async (buffer) => {
            const duration = buffer.duration;
            duration_ms = Math.floor(duration * 1000);

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
          });
        } else {
          console.error("Failed to read the audio file");
          showToast("Failed to read the audion file", "failure");
        }
      };
      reader.readAsArrayBuffer(credentials.song[0]);
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
      setCurrentUser(res);
      showToast("Account upgraded to artist ", "success");
      console.log(currentUser);
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

  const pfpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pfpDialogRef.current?.close();
    try {
      if (pfpFileRef.current?.files) {
        const credentials = {
          image: pfpFileRef.current?.files[0],
          email: pfpEmailRef.current?.value,
          isArtist: user?.isArtist,
        };
        const updatedUser = await UserApi.updateUser(
          user ? user._id : "",
          credentials
        );
        console.log(updatedUser);
      }
    } catch (er) {
      console.error(er);
      if (er instanceof Error) showToast(er.message, "failure");
    }
  };

  useEffect(() => {
    getLikedSongs();
    getPublishedTracks();
    // setIsArtist(isArtist);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentUser]);

  return (
    <div className={styles.majorCont}>
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
          <div className={styles.pfpCont}>
            <div className={styles.profileImg}>
              <div className={styles.pfpImgCont}>
                <p className={styles.pfpText}>Change profile</p>
                <img
                  className={styles.pfpImg}
                  src={currentUser?.profileImgURL}
                  alt="Profile Image"
                  onClick={() => {
                    pfpDialogRef.current?.showModal();
                  }}
                />
              </div>
              <dialog className={styles2.dialogCont} ref={pfpDialogRef}>
                <button
                  className={styles2.closeBtn}
                  onClick={() => {
                    pfpDialogRef.current?.close();
                  }}
                >
                  X
                </button>
                <form
                  action="post"
                  encType="multipart/form-data"
                  className={styles2.formGroup}
                  onSubmit={pfpSubmit}
                >
                  <div className={styles3.textGroup}>
                    <label className={styles3.formLabel} htmlFor="image">
                      Chose a profile image
                    </label>
                    <input
                      className={`${styles3.inputArea}`}
                      ref={pfpFileRef}
                      type="file"
                      name="image"
                    />
                  </div>
                  <div className={styles3.textGroup}>
                    <label className={styles3.formLabel} htmlFor="username">
                      Change Email
                    </label>
                    <input
                      ref={pfpEmailRef}
                      type="text"
                      name="email"
                      placeholder="Change Email"
                      className={`${styles3.inputArea}`}
                    />
                  </div>
                  <button ref={pfpSubBtnRef}>Submit</button>
                </form>
              </dialog>
            </div>
            <div className={styles.userName}>
              <p style={{ marginBottom: "-25px" }}>Profile</p>
              {currentUser?.username}
            </div>
          </div>
          {!currentUser?.isArtist ? (
            <button className={styles.upgradeBtn} onClick={handleClick}>
              Upgrade to Artist
            </button>
          ) : (
            <p className={styles.upgradeBtn}>Artist</p>
          )}
        </div>
        <div className={styles.friendSec} style={{ display: "flex", justifyContent: "space-between",marginBottom:"1rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "80vw",
            }}
          >
            <button
              className={styles.friendBtn}
              onClick={() => {
                setShowFriends(false);
                setShowFriendReq(!showFrindReq);
              }}
            >
              <img src="../public/requests.svg" />
            </button>
            {showFrindReq && (
              <div className={styles.friendRequestSec}>
                Pending Requests
                <FriendList requested={true} user={currentUser!} />
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              width: "80vw",
            }}
          >
            <button
              className={styles.friendBtn}
              onClick={() => {
                setShowFriends(!showFrinds);
                setShowFriendReq(false);
              }}
            >
              <img src="../public/friends.svg" />
            </button>
            {showFrinds && (
              <div className={styles.friendSection}>
                Friends
                <FriendList requested={false} user={currentUser!} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.topTrackSec}>
          Recent Tracks
          <TrackHistoryList />
        </div>
        <div className={styles.topAlbumSec}>
          Top albums
          <PlaylistHistory />
        </div>

        {currentUser.isArtist && (
          <div>
            <div style={{ position: "relative" }}>
              <p>Published Tracks</p>
              <div className={styles.playlistView}>
                {tracks &&
                  tracks.map((track, index) => (
                    <PlaylistView
                      artist={track.artists[0].name}
                      duration={track.duration_ms}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
