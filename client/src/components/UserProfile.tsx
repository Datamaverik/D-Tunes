import { useEffect, useState } from "react";
import styles from "../components/styles/profile.module.css";
import FriendList from "../pages/FriendList";
import { FetchedUser, fetchedTrack } from "../pages/Profile";
import PlaylistView from "./PlaylistView";
import SongPlayer from "./SongPlayer";
import * as FriendApi from "../network/friends";
import * as trackApi from "../network/tracks";
import * as UserApi from "../network/api";
import useToast from "../CustomHooks/Toast.hook";
import { useLocation } from "react-router-dom";

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
          console.log(res);
          showToast(res.message, "success");
          setStatus(1);
        } else if (status === 2) {
          const res = await FriendApi.acceptFriendReq(
            currentUser._id,
            friend._id
          );
          console.log(res);
          showToast(res.message, "success");
          setStatus(3);
          setShowRequested(false);
        } else if (status === 3) {
          const res = await FriendApi.removeFriend(currentUser._id, friend._id);
          console.log(res);
          showToast(res.message, "warning");
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
        console.log(res);
        showToast(res.message, "warning");
        setStatus(0);
        setShowRequested(false);
      }
    } catch (er) {
      console.error(er);
    }
  };

  useEffect(() => {
    getPublishedTracks();
    getLikedSongs();
    getFriend();
    setUser(state.user);
    setCurrentUser(state.currentUser);
    setStatus(state.status);
    setShowRequested(state.requested);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
                  ? "Pending"
                  : "Remove Friend"}
              </button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                <FriendList you={currentUser} requested={false} user={user!} />
              </div>
            )}
          </div>
        </div>

        {user.isArtist && (
          <div>
            <div style={{ position: "relative" }}>
              <p style={{ marginLeft: "50%", transform: "translateX(-25%)" }}>
                Published Tracks
              </p>
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
  );
};

export default UserProfile;
