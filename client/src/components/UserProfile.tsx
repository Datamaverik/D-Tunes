import { useEffect, useState } from "react";
import styles from "../components/styles/profile.module.css";
import { FetchedUser, fetchedTrack } from "../pages/Profile";
import PlaylistView from "./PlaylistView";
import SongPlayer from "./SongPlayer";
import * as FriendApi from "../network/friends";
import * as trackApi from "../network/tracks";
import * as UserApi from "../network/api";
import * as PlaylistApi from "../network/playlist";
import useToast from "../CustomHooks/Toast.hook";
import { useLocation } from "react-router-dom";
import UsersFriendList from "./UsersFriendList";
import { fetchedPlaylistModel } from "./Sidebar";
import UserPlaylists from "./UserPlaylists";

const UserProfile = () => {
  const { showToast } = useToast();

  const { state } = useLocation();

  const [tracks, setTracks] = useState<fetchedTrack[]>([]);
  const [trackId, setTrackId] = useState<string>("");
  const [showFrinds, setShowFriends] = useState<boolean>(false);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [user, setUser] = useState<FetchedUser>(state.user);
  const [Status, setStatus] = useState<number>(state.status);
  const [friend, setFriend] = useState<FetchedUser | null>(null);
  const [playlists, setPlaylists] = useState<fetchedPlaylistModel[]>([]);
  const [showRequested, setShowRequested] = useState<boolean>(state.requested);
  const [currentUser, setCurrentUser] = useState<FetchedUser>(
    state.currentUser
  );

  const getPublishedTracks = async () => {
    try {
      if (!user) return;
      const response = await trackApi.getTrackByUser(user._id);
      setTracks(response);
    } catch (er) {
      if (er instanceof Error) showToast(er.message, "warning");
    }
  };
  async function getFriend() {
    try {
      const response: FetchedUser = await UserApi.getUserById(state.friendId);
      const user = await UserApi.getLoggedInUser();
      setCurrentUser(user.user);
      setFriend(response);
    } catch (er) {
      console.error(er);
    }
  }
  const fetchPlaylists = async () => {
    try {
      const response: fetchedPlaylistModel[] =
        await PlaylistApi.getUserPublicPlaylistById(user._id);
      setPlaylists(response);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllData = async () => {
    try {
      await getPublishedTracks();
      await getLikedSongs();
      await getFriend();
      setUser(state.user);
      setCurrentUser(state.currentUser);
      setStatus(state.status);
      setShowRequested(state.requested);
    } catch (error) {
      console.error(error);
    }
  };

  async function getLikedSongs() {
    try {
      const response = await UserApi.getLikedSongs();
      setLikedSongs(response);
    } catch (er) {
      console.error(er);
    }
  }

  const handleClick = async (status: number) => {
    try {
      if (currentUser && friend) {
        if (status === 0) {
          const res = await FriendApi.addFriendReq(currentUser._id, friend._id);
          showToast(res.message, "success");
          setStatus(1);
        } else if (status === 2) {
          const res = await FriendApi.acceptFriendReq(
            currentUser._id,
            friend._id
          );
          showToast(res.message, "success");
          setStatus(3);
          setShowRequested(false);
        } else if (status === 3) {
          const res = await FriendApi.removeFriend(currentUser._id, friend._id);
          showToast(res.message, "warning");
          setStatus(0);
        } else if (status === 1) {
          await FriendApi.removeFriend(currentUser._id, friend._id);
          showToast("Friend Request Cancelled", "warning");
          setStatus(0);
        }
      }
    } catch (er) {
      console.error(er);
    }
  };

  const handleReject = async () => {
    try {
      if (currentUser && friend) {
        const res = await FriendApi.removeFriend(currentUser._id, friend._id);

        showToast(res.message, "warning");
        setStatus(0);
        setShowRequested(false);
      }
    } catch (er) {
      console.error(er);
    }
  };

  useEffect(() => {
    fetchAllData();
    setShowFriends(false);
    fetchPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <div className={styles.majorCont}>
      <div className={styles.profilePage}>
        <div className={styles.userProfileSec}>
          <div className={styles.pfpCont}>
            <div className={styles.userProfileImg}>
              <div className={styles.pfpImgCont}>
                <img
                  src={user?.profileImgURL}
                  alt="Profile Image"
                  onClick={() => {}}
                />
              </div>
            </div>
            <div className={styles.userName}>
              <p style={{ marginBottom: "-25px" }}>Profile</p>
              {user?.username}
            </div>
          </div>
          {showRequested && state.status === 2 && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => handleClick(Status)}>Confirm</button>
              <button onClick={handleReject}>Delete</button>
            </div>
          )}
          {!showRequested && state.status !== 2 && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => handleClick(Status)}>
                {Status === 0
                  ? "Add Friend"
                  : Status === 1
                  ? "Cancel Request"
                  : "Remove Friend"}
              </button>
            </div>
          )}
        </div>
        <div
          className={styles.friendList}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
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
                setShowFriends(!showFrinds);
              }}
            >
              <img src="../public/friends.svg" />
            </button>
            {showFrinds && (
              <div className={styles.friendRequestSec}>
                Friends
                <UsersFriendList user={currentUser!} friend={user!} />
              </div>
            )}
          </div>
        </div>
        <div className={styles.publicPlaylists}>
          Public Playlists
          <div style={{ marginBottom: "10px" }}>
            {playlists &&
              playlists.map((playlist) => (
                <UserPlaylists
                  onDelete={() => {
                    console.log("clicked");
                  }}
                  playlistId={playlist._id}
                  key={playlist.name}
                  name={playlist.name}
                  image={playlist.images[0]}
                  totalDuration={playlist.duration}
                />
              ))}
          </div>
        </div>
        <div className={styles.pulishedTracks}>
          {user.isArtist && (
            <div>
              <div style={{ position: "relative" }}>
                Published Tracks
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
