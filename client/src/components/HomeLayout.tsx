import SerachBar from "./SerachBar";
import Sidebar from "./Sidebar";
import styles from "../components/styles/home.module.css";
import { Outlet } from "react-router-dom";

interface HomeLayoutProps {
  isSidebarVisible: boolean;
}

const HomeLayout = ({ isSidebarVisible }: HomeLayoutProps) => {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.sideBar} ${isSidebarVisible ? styles.show : styles.hide}`}
      >
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
