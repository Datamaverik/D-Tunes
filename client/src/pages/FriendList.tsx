import { FetchedUser } from "./Profile";
import * as FriendsApi from "../network/friends";
import { useEffect, useState } from "react";
import UserListView from "../components/UserListView";

interface UserListProps {
  user: FetchedUser;
  requested: boolean;
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
const FriendList = ({ user, requested }: UserListProps) => {
  const [friends, setFriends] = useState<FetchedUserwithFriends | null>(null);
  async function getAllFriends() {
    try {
      const friends = await FriendsApi.getAllFriends(user._id);
      setFriends(friends);
    } catch (er) {
      console.error(er);
    }
  }
  useEffect(() => {
    getAllFriends();
    // console.log(requested);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      {friends?.friends.map((friend, ind) => (
        <UserListView
          key={ind}
          requested={requested}
          friendId={friend.recipient}
          status={friend.status}
        />
      ))}
    </div>
  );
};

export default FriendList;
