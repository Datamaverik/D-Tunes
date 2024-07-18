import axios from "axios";
import { icons } from "../models/icons";

const baseURL = "http://localhost:5000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface playlistCredentials {
  name: string;
  isPublic: boolean;
  songs: string[];
  images: File;
  duration: number;
}
export const createPlaylist = async (credentials: FormData) => {
  try {
    const response = await axios.post(`${baseURL}/api/playlist/`, credentials, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(credentials);
    console.log("credentials sent from playlist.network.ts");
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const deletePlaylist = async (playlist: string) => {
  try {
    const response = await api.delete(`/api/playlist/delete/${playlist}`);
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const getAllPublicPlaylists = async () => {
  try {
    const response = await api.get("/api/playlist/allPublic");
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const getUserPvtPlaylists = async () => {
  try {
    const response = await api.get(`/api/playlist/userPrivate`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllUserPlaylists = async () => {
  try {
    const response = await api.get(`/api/playlist/userAll`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getPlaylistById = async (playlistId: string) => {
  try {
    const response = await api.get(`/api/playlist/${playlistId}`);
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const addRemPlaylist = async (
  playlistId: string,
  songId: string,
  duration: number
) => {
  try {
    const response = await api.post(
      `/api/playlist/addRemPlaylist/${playlistId}`,
      { song: songId, duration: duration }
    );
    return response;
  } catch (er) {
    console.error(er);
  }
};

export interface updatePlaylistCredentials {
  name: string;
  isPublic: boolean;
  images: icons[];
}
export const updatePlaylist = async (
  credentials: updatePlaylistCredentials,
  playlistId: string
) => {
  try {
    const response = await api.post(`/api/update/${playlistId}`, credentials);
    return response.data;
  } catch (er) {
    console.error(er);
  }
};
