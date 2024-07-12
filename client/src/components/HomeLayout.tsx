import SerachBar from "./SerachBar";
import Sidebar from "./Sidebar";
import styles from "../components/styles/home.module.css";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <SerachBar />
        <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
