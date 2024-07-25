import axios, { AxiosError } from "axios";
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
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const deletePlaylist = async (playlist: string) => {
  try {
    const response = await api.delete(`/api/playlist/delete/${playlist}`);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getAllPublicPlaylists = async () => {
  try {
    const response = await api.get("/api/playlist/allPublic");
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getUserPvtPlaylists = async () => {
  try {
    const response = await api.get(`/api/playlist/userPrivate`);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getAllUserPlaylists = async () => {
  try {
    const response = await api.get(`/api/playlist/userAll`);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getUserPublicPlaylistById = async (userId: string) => {
  try {
    const response = await api.get(`/api/playlist/userPublic/${userId}`);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getPlaylistById = async (playlistId: string) => {
  try {
    const response = await api.get(`/api/playlist/${playlistId}`);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
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
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
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
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};
