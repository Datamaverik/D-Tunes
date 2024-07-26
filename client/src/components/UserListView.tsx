import { useEffect, useState } from "react";
import styles from "../components/styles/Genre.module.css";
import * as UserApi from "../network/api";
import * as FriendApi from "../network/friends";
import { FetchedUser } from "../pages/Profile";
import useToast from "../CustomHooks/Toast.hook";
import { useNavigate } from "react-router-dom";

interface UserListViewProps {
  friendId: string;
  status: number;
  requested: boolean;
}
const UserListView = ({ friendId, status, requested }: UserListViewProps) => {
  const { showToast } = useToast();
  const [friend, setFriend] = useState<FetchedUser | null>(null);
  const [currentUser, setCurrentUser] = useState<FetchedUser | null>(null);
  const [Status, setStatus] = useState<number>(status);
  const [showRequested, setShowRequested] = useState<boolean>(requested);

  const navigate = useNavigate();

  async function getFriend() {
    try {
      const response: FetchedUser = await UserApi.getUserById(friendId);
      const user = await UserApi.getLoggedInUser();
      setCurrentUser(user.user);
      setFriend(response);
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
          setStatus(0)
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
    // console.log(requested + " " + status);
    getFriend();
    setStatus(status);
    setShowRequested(requested);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, friendId, requested, status]);

  const handleUserClick = (user: FetchedUser) => {
    console.log("clicked");
    navigate(`/userProfile`, {
      state: { user, currentUser, status, friendId, requested },
    });
  };

  if (showRequested && Status === 2)
    return (
      <div className={styles.songCont}>
        <div
          className={styles.songImgCont}
          style={{ backgroundImage: `url(${friend?.profileImgURL})` }}
        ></div>
        <div className={styles.songName}>
          <p onClick={() => handleUserClick(friend!)}>{friend?.username}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => handleClick(Status)}>Confirm</button>
            <button onClick={handleReject}>Delete</button>
          </div>
        </div>
      </div>
    );
  else if (!showRequested && Status !== 2)
    return (
      <div className={styles.songCont}>
        <div
          className={styles.songImgCont}
          style={{ backgroundImage: `url(${friend?.profileImgURL})` }}
        ></div>
        <div className={styles.songName}>
          <p onClick={() => handleUserClick(friend!)}>{friend?.username}</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => handleClick(Status)}>
              {Status === 0
                ? "Add Friend"
                : Status === 1
                ? "Cancel Request"
                : "Remove Friend"}
            </button>
          </div>
        </div>
      </div>
    );
};

export default UserListView;
