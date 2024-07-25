import UserListView from "../components/UserListView";
import { FetchedUser } from "../pages/Profile";
import * as FriendApi from "../network/friends";
import { useEffect, useState } from "react";
import styles from "../components/styles/Genre.module.css";
import { FetchedUserwithFriends } from "../pages/FriendList";

interface UsersFriendListProps {
  user: FetchedUser;
  friend: FetchedUser;
}
interface Friends {
  recipient: string;
  requester: string;
  _id: string;
  status: number;
}

const UsersFriendList = ({ user, friend }: UsersFriendListProps) => {
  const [friends, setFriends] = useState<FetchedUserwithFriends | null>(null);
  const [users, setUsers] = useState<Friends[]>([]);
  const [currentUserPresent, setCurrentUserPresent] = useState<boolean>(false);

  async function getAllFriends() {
    try {
      const response = await FriendApi.getAllFriends(user._id);
      setFriends(response);
    } catch (er) {
      console.error(er);
    }
  }
  async function getAllUsers() {
    try {
      const response = await FriendApi.getAllFriends(friend._id);
      setUsers(
        response.friends.filter(
          (friend: Friends) => friend.recipient !== user._id
        )
      );
      response.friends.map((friend: Friends) => {
        if (friend.recipient === user._id) setCurrentUserPresent(true);
      });
    } catch (er) {
      console.error(er);
    }
  }

  const passStatus = (id: string): number => {
    let status: number = 0;
    friends?.friends.map((friend) => {
      if (friend.recipient === id) {
        status = friend.status;
      }
    });
    return status;
  };
  useEffect(() => {
    getAllFriends();
    getAllUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      {currentUserPresent && (
        <div className={styles.songCont}>
          <div
            className={styles.yourImgCont}
            style={{ backgroundImage: `url(${user?.profileImgURL})` }}
          ></div>
          <div>
            <p className={styles.yourName}>{user.username}</p>
            <p className={styles.you}>You</p>
          </div>
        </div>
      )}
      {users.length > 0
        ? users.map((user, ind) =>
            passStatus(user.recipient) === 2 ? (
              <UserListView
                requested={true}
                key={ind}
                friendId={user.recipient}
                status={passStatus(user.recipient)}
              />
            ) : (
              <UserListView
                requested={false}
                key={ind}
                friendId={user.recipient}
                status={passStatus(user.recipient)}
              />
            )
          )
        : "No Friends Found"}
    </div>
  );
};

export default UsersFriendList;
