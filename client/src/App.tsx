import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFoundPg from "./pages/NotFoundPg";
import Navbar from "./components/Navbar";
import styles from "./components/styles/Navbar.module.css";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "./network/api";
import { AxiosError } from "axios";
import Profile from "./pages/Profile";
import HomeLayout from "./components/HomeLayout";
import Genres from "./pages/Genres";
import Tracks from "./pages/Tracks";
import Playlist from "./pages/Playlist";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await getLoggedInUser();
        if (!response) return;
        setLoggedInUser(response.user.username);
        navigate("/");
      } catch (er) {
        if (er instanceof AxiosError) alert(er.response?.data.message);
        console.log(er);
      }
    };
    fetchLoggedInUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignup = (username: string) => {
    setLoggedInUser(username);
    navigate("/");
  };

  const handleLogin = (username: string) => {
    setLoggedInUser(username);
    navigate("/");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate("/");
  };

  const handleGenreClick = (id:string)=>{
    navigate(`/tracks/${id}`);
  }

  const handlePlaylistClick = (id: string) => {
    navigate(`/playlist/${id}`);
  };
  return (
    <>
      <Navbar
        loggedInUser={loggedInUser}
        onLogOutSuccessful={handleLogout}
        links={
          <div className={styles.links}>
            <NavLink to={"/api/signup"}>Signup</NavLink>
            <NavLink to={"/api/login"}>Login</NavLink>
          </div>
        }
        homeLink={
          <NavLink to={"/"}>
            <img
              className={styles.logos}
              src="../icons8-home.svg"
              alt=""
              id="home-logo"
            />
          </NavLink>
        }
      />
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route path="/" element={<Genres onClick={handleGenreClick} />} />
          <Route path="/tracks/:id" element={<Tracks onClick={handlePlaylistClick}/>} />
          <Route path="/playlist/:id" element={<Playlist />} />
        </Route>

        <Route path="/api">
          <Route
            path="signup"
            element={<SignUp onSuccessfulSignUp={handleSignup} />}
          />
          <Route
            path="login"
            element={<Login onSuccessfulLogin={handleLogin} />}
          />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFoundPg />} />
      </Routes>
    </>
  );
}

export default App;
