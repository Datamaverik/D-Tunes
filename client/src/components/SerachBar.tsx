import { useState } from "react";
import styles from "../components/styles/form.module.css";
import * as TracksApi from "../network/tracks";
import * as SpotifyApi from "../network/spotify";
import * as UserApi from "../network/api";
import { useNavigate } from "react-router-dom";
import ToggleBtn from "./ToggleBtn";

const SerachBar = () => {
  const [query, setQuery] = useState<string>("");
  const [isSpotifySearch, setIsSpotifySearch] = useState<boolean>(false);
  // const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const triggerToggle = () => {
    setIsSpotifySearch(!isSpotifySearch);
  };

  const handleSearch = async () => {
    try {
      if (isSpotifySearch) {
        const response = await SpotifyApi.getSerchedSongs(query);
        const response2 = await TracksApi.getSearchedTracks(query);
        const tracks = [...response2,...response];
        console.log(tracks);
        navigate(`/serachlist`, {
          state: { track: tracks},
        });
      } else {
        const response = await UserApi.getSearchedUsers(query);
        // setUsers(response);
        console.log(response);
      }
    } catch (er) {
      console.error(er);
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
