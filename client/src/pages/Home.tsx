import { ReactNode } from "react";
import styles from "../components/styles/home.module.css";
import { Routes, Route } from "react-router-dom";
import Genres from "./Genres";
import Tracks from "./Tracks";
import Playlist from "./Playlist";

interface HomeProps {
  serchBar: ReactNode;
  sideBar: ReactNode;
}

const Home = ({ serchBar, sideBar}: HomeProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.sideBar}>{sideBar}</div>
      <div className={styles.content}>
        {serchBar}
        <Routes>
          <Route path="*" element={<Genres />} />
          <Route path="playlist/:id" element={<Playlist />} />
          <Route path="track/:id" element={<Tracks />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
