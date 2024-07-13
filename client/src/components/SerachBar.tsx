import { useState } from "react";
import styles from "../components/styles/form.module.css";
// import { User } from "../models/User";
import * as SpotifyApi from "../network/spotify";
import * as UserApi from "../network/api";
import { useNavigate } from "react-router-dom";

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
        navigate(`/serachlist`, { state: { track: response } });
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
      <div
        onClick={triggerToggle}
        className={`${styles.toggle} ${
          isSpotifySearch ? styles.toggleChecked : ""
        }`}
      >
        <div className={styles.toggleCont}>
          <div className={styles.toggleCheck}>
            <span>
              <img
                style={{ height: "25px", width: "25px" }}
                src="../public/musicLogo.svg"
                alt=""
              />
            </span>
          </div>
          <div className={styles.toggleUncheck}>
            <span>
              <img
                style={{ height: "30px", width: "35px" }}
                src="../public/profile.svg"
                alt=""
              />
            </span>
          </div>
        </div>
        <div className={styles.toggleCircle}></div>
        <input
          className={styles.toggleInput}
          defaultChecked={isSpotifySearch}
          type="checkbox"
          aria-label="Toggle Button"
        />
      </div>
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
