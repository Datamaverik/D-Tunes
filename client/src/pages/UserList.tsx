import UserListView from "../components/UserListView";
import { FetchedUser } from "./Profile";
import * as FriendApi from "../network/friends";
import { useEffect, useState } from "react";
import { FetchedUserwithFriends } from "./FriendList";
import { useLocation } from "react-router-dom";

const UserList = () => {
  const [friends, setFriends] = useState<FetchedUserwithFriends | null>(null);
  // const [requestStatus, setRequestStatus] = useState<boolean>(false);
  const { state } = useLocation();
  const users: FetchedUser[] = state.users;
  const user: FetchedUser = state.user.user;
  async function getAllFriends() {
    try {
      const response = await FriendApi.getAllFriends(user._id);
      // console.log(response);
      setFriends(response);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      {users.length > 0
        ? users.map((user, ind) =>
            passStatus(user._id) === 2 ? (
              <UserListView
                requested={true}
                key={ind}
                friendId={user._id}
                status={passStatus(user._id)}
              />
            ) : (
              <UserListView
                requested={false}
                key={ind}
                friendId={user._id}
                status={passStatus(user._id)}
              />
            )
          )
        : "No Users Found"}
    </div>
  );
};

export default UserList;
