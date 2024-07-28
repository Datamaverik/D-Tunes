import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFoundPg from "./pages/NotFoundPg";
import Navbar from "./components/Navbar";
import styles from "./components/styles/Navbar.module.css";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "./network/api";
import Profile, { FetchedUser } from "./pages/Profile";
import HomeLayout from "./components/HomeLayout";
import Genres from "./pages/Genres";
import Tracks from "./pages/Tracks";
import Playlist from "./pages/Playlist";
import PrivateRoute from "./components/PrivateRoute";
import Searchlist from "./pages/Searchlist";
import UserTracks from "./pages/UserTracks";
import ToastList from "./components/ToastList";
import useToast from "./CustomHooks/Toast.hook";
import UserList from "./pages/UserList";
import UserProfile from "./components/UserProfile";
import { LoadingProvider, useLoading } from "./Contexts/Loading.context";
import LoadingScren from "./pages/LoadingScren";

function App() {
  const { isLoading } = useLoading();
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<FetchedUser | null>(null);
  const [isArtist, setIsArtist] = useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { toasts, removeToast } = useToast();
  // const { showToast } = useToast();
  const navigate = useNavigate();
const fetchLoggedInUser = async () => {
  try {
    const response = await getLoggedInUser();
    if (!response) {
      return;
    }
    setLoggedInUser(response.user.username);
    setIsArtist(response.user.isArtist);
    setCurrentUser(response.user);
    navigate("/");
  } catch (er) {
    if (er instanceof Error) {
      console.log(er.message);
    }
  }
};
  useEffect(() => {
    fetchLoggedInUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignup = (username: string) => {
    setLoggedInUser(username);
    navigate("/");
    window.location.reload();
  };

  const handleLogin = (username: string) => {
    fetchLoggedInUser();
    setLoggedInUser(username);
    navigate("/");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate("/");
  };

  const handleGenreClick = (id: string) => {
    navigate(`/tracks/${id}`);
  };

  const handlePlaylistClick = (id: string) => {
    navigate(`/playlist/${id}`);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <LoadingProvider>
      (
      {isLoading ? (
        <LoadingScren />
      ) : (
        <>
          <div className={styles.navbarCont}>
            <Navbar
              loggedInUser={loggedInUser}
              onLogOutSuccessful={handleLogout}
              onToggleSidebar={() => {
                toggleSidebar();
              }}
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
          </div>
          <ToastList removeToast={removeToast} data={toasts} />
          <Routes>
            <Route element={<PrivateRoute loggedInUser={loggedInUser} />}>
              <Route
                path="/"
                element={<HomeLayout isSidebarVisible={isSidebarVisible} />}
              >
                <Route
                  path="/"
                  element={<Genres onClick={handleGenreClick} />}
                />
                <Route
                  path="/tracks/:id"
                  element={<Tracks onClick={handlePlaylistClick} />}
                />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="/serachlist" element={<Searchlist />} />
                <Route path="/userlist" element={<UserList />} />
                <Route path="/userProfile" element={<UserProfile />} />
                <Route path="/userTracks" element={<UserTracks />} />
                <Route
                  path="profile"
                  element={<Profile isArtist={isArtist} user={currentUser} />}
                />
              </Route>
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
            </Route>
            <Route path="*" element={<NotFoundPg />} />
          </Routes>
        </>
      )}
      )
    </LoadingProvider>
  );
}

export default App;
