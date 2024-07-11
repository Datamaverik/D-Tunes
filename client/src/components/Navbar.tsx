import { ReactNode, useState } from "react";
import styles from "./styles/Navbar.module.css";
import NavBarLoggedInView from "./NavBarLoggedInView";

interface NavBarProps {
  loggedInUser: string | null;
  onLogOutSuccessful: () => void;
  links: ReactNode;
  homeLink: ReactNode;
}

const Navbar = ({
  loggedInUser,
  onLogOutSuccessful,
  links: children,
  homeLink,
}: NavBarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleClick = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          {/* <img src={`/ADD-LOGO-SVG-HERE`} alt="Logo" className={styles.logo} /> */}
          {homeLink}
          <span>D-Tunes</span>
        </div>
        <div className={styles.hamburger}>
          <button className={styles.toggleButton} onClick={handleToggleClick}>
            {/* {add svg of hamburger here} */}
            <img src="./hamburgerMenu.svg" alt="" />
          </button>
          <div
            className={`${styles.collapse} ${!isCollapsed ? styles.show : ""}`}
            id="main-navbar"
          >
            {loggedInUser ? (
              <NavBarLoggedInView
                user={loggedInUser}
                onLogOutSuccessful={onLogOutSuccessful}
              />
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
