import { useState } from "react";
import styles from "../components/styles/form.module.css";
import * as TracksApi from "../network/tracks";
import * as SpotifyApi from "../network/spotify";
import * as UserApi from "../network/api";
import { useNavigate } from "react-router-dom";
import ToggleBtn from "./ToggleBtn";
import { FetchedUser } from "../pages/Profile";
import useLoading from "../CustomHooks/Loading.hook";

const SerachBar = () => {
  const {setLoading} = useLoading();
  const [query, setQuery] = useState<string>("");
  const [isSpotifySearch, setIsSpotifySearch] = useState<boolean>(false);
  // const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const triggerToggle = () => {
    setIsSpotifySearch(!isSpotifySearch);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (isSpotifySearch) {
        const response = await SpotifyApi.getSerchedSongs(query);
        const response2 = await TracksApi.getSearchedTracks(query);
        const tracks = [...response2, ...response];
        console.log(tracks);
        navigate(`/serachlist`, {
          state: { track: tracks },
        });
      } else {
        const response = await UserApi.getSearchedUsers(query);
        const currentUser = await UserApi.getLoggedInUser();
        navigate(`/userlist`, {
          state: {
            users: response.filter(
              (user: FetchedUser) => user._id !== currentUser.user._id
            ),
            user: currentUser,
          },
        });
      }
    } catch (er) {
      console.error(er);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className={styles.searchBar}>
      <ToggleBtn
        onClick={triggerToggle}
        isToggleOn={isSpotifySearch}
        img1={"../public/musicLogo.svg"}
        img2={"../public/profile.svg"}
      />
      <input
        type="serach"
        name="search-form"
        id="serch-form"
        value={query}
        className={styles.searchInput}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder={isSpotifySearch ? "Search Tacks..." : "Serach Users..."}
      />
      <button onClick={handleSearch} className={styles.searchIcon}>
        <img src="../public/icons8-search.svg" alt="" />
      </button>
    </div>
  );
};

export default SerachBar;
