import { useEffect, useState } from "react";
import styles from "../components/styles/Sidebar.module.css";
import * as playlistApi from "../network/playlist";
import UserPlaylists from "./UserPlaylists";
import { FieldError, useForm } from "react-hook-form";
import TextInputField from "./form/TextInputField";
import { icons } from "../models/icons";
import LikedSongs from "./LikedSongs";

export interface fetchedPlaylistModel {
  _id: string;
  name: string;
  isPublic: boolean;
  songs: string[];
  images: icons[];
  duration: number;
}

const Sidebar = () => {
  const dialogBox = document.getElementById("myDialog") as HTMLDialogElement;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<playlistApi.playlistCredentials>();

  const [playlists, setPlaylists] = useState<fetchedPlaylistModel[]>([]);

  async function onSubmit(credentials: playlistApi.playlistCredentials) {
    dialogBox.close();
    try {
      const newPlaylist = await playlistApi.createPlaylist(credentials);
      setPlaylists([...playlists, newPlaylist]);
      console.log(newPlaylist);
    } catch (er) {
      console.error(er);
    }
  }

  async function deletePlaylist(id: string) {
    try {
      const response = await playlistApi.deletePlaylist(id);
      console.log(response);
    } catch (er) {
      console.error(er);
    }
    setPlaylists(playlists.filter((playlist) => playlist._id !== id));
    // console.log(id);
  }

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await playlistApi.getAllUserPlaylists();
        setPlaylists(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlaylists();
  }, []);
  return (
    <>
      <dialog id="myDialog" className={styles.dialogCont}>
        <button
          className={styles.closeBtn}
          onClick={() => {
            dialogBox.close();
          }}
        >
          X
        </button>
        <form
          action="post"
          className={styles.formGroup}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextInputField
            name="name"
            label="Name of Playlist"
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
          <div className={styles.checkboxCont}>
            <label htmlFor="isPublic">Make Public</label>
            <TextInputField
              className={styles.checkBox}
              id="isPublic"
              name="isPublic"
              type="checkbox"
              label=""
              register={register}
              error={errors.isPublic as FieldError}
            />
          </div>
          <div>
            <button type="submit" className={styles.signUpBtn}>
              Create
            </button>
          </div>
        </form>
      </dialog>
      <div className={styles.sideBarCont}>
        <button
          style={{ marginBottom: "1rem" }}
          onClick={() => {
            dialogBox.showModal();
          }}
        >
          Create Playlist
        </button>
        <LikedSongs/>
        {playlists &&
          playlists.map((playlist) => (
            <UserPlaylists
              onDelete={() => deletePlaylist(playlist._id)}
              playlistId={playlist._id}
              key={playlist.name}
              name={playlist.name}
              image={playlist.images[0]}
              totalDuration={playlist.duration}
            />
          ))}
      </div>
    </>
  );
};

export default Sidebar;
