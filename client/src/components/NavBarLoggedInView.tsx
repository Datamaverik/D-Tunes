import { NavLink } from "react-router-dom";
import * as UserApi from "../network/api";
import styles from "./styles/Navbar.module.css";
import useToast from "../CustomHooks/Toast.hook";

interface NavBarLoggedInViewProps {
  user: string | null;
  onLogOutSuccessful: () => void;
}

const NavBarLoggedInView = ({
  user,
  onLogOutSuccessful,
}: NavBarLoggedInViewProps) => {
  const { showToast } = useToast();
  async function logout() {
    try {
      const response = await UserApi.logout();
      onLogOutSuccessful();
      console.log(response);
    } catch (er) {
      console.error(er);
      if (er instanceof Error) showToast(er.message, "failure");
    }
  }
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
      >
        <NavLink to={"/profile"}>
          <img className={styles.logos} src="../public/profile.svg" alt="" />
        </NavLink>
        <p>{user}</p>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default NavBarLoggedInView;
