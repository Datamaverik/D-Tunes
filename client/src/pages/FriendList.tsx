import { FetchedUser } from "./Profile";
import * as FriendsApi from "../network/friends";
import { useEffect, useState } from "react";
import UserListView from "../components/UserListView";
import styles from "../components/styles/Genre.module.css";

interface UserListProps {
  user: FetchedUser;
  requested: boolean;
  you?: FetchedUser;
}
export interface FetchedUserwithFriends extends FetchedUser {
  friends: [
    {
      recipient: string;
      requester: string;
      _id: string;
      status: number;
    }
  ];
}
const FriendList = ({ user, requested, you }: UserListProps) => {
  const [friends, setFriends] = useState<FetchedUserwithFriends | null>(null);
  async function getAllFriends() {
    try {
      const friends:FetchedUserwithFriends = await FriendsApi.getAllFriends(user._id);
      setFriends(friends);
      friends
    } catch (er) {
      console.error(er);
    }
  }
  useEffect(() => {
    getAllFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div key={user._id}>
      {friends?.friends.map((friend, ind) =>
        friend.recipient !== you?._id ? (
          <UserListView
            key={ind}
            requested={requested}
            friendId={friend.recipient}
            status={friend.status}
          />
        ) : (
          <div className={styles.songCont}>
            <div
              className={styles.songImgCont}
              style={{ backgroundImage: `url(${you?.profileImgURL})` }}
            ></div>
            <div>
              <p className={styles.yourName}>{you.username}</p>
              <p className={styles.you}>You</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FriendList;
