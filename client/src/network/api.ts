import axios, { AxiosError } from "axios";

const baseURL = "http://localhost:5000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLoggedInUser = async () => {
  try {
    const response = await api.get("/api/users/");
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) alert(er.response?.data.message);
  }
};

export interface signUpCredentials {
  username: string;
  password: string;
  email: string;
}

export const signUp = async (credentials: signUpCredentials) => {
  try {
    const response = await api.post("/api/users/signup", credentials);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) alert(er.response?.data.message);
  }
};

export interface loginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: loginCredentials) => {
  try {
    const response = await api.post("/api/users/login", credentials);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) alert(er.response?.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/api/users/logout");
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) alert(er.response?.data.message);
  }
};

export const getLikedSongs = async () => {
  try {
    const response = await api.get("/api/users/likedSongs");
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

interface songIdObj {
  songId: string;
}
export const toggleLike = async (songId: songIdObj) => {
  try {
    const response = await api.post("/api/users/toggleLike", songId);
    return response.data;
  } catch (er) {
    console.error(er);
  }
};
