import axios, { AxiosError } from "axios";
import * as UserApi from "./api";

const baseURL = "http://localhost:5000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface trackInput {
  name: string;
  duration_ms: string;
  image: File;
  song: File;
  genre: string;
}

export const saveTrack = async (songCredential: trackInput) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/tracks/`,
      songCredential,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getPublishedTracks = async () => {
  try {
    const artist = await UserApi.getLoggedInUser();
    const response = await api.get(
      `/api/tracks/allPublished/${artist.user._id}`
    );
    return response.data;
  } catch (er) {
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getTrackByID = async (trackId: string) => {
  try {
    const response = await api.get(`/api/tracks/published/${trackId}`);
    return response.data;
  } catch (er) {
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getTrackByUser = async (userId: string) => {
  try {
    const response = await api.get(`/api/tracks/tracksByUser/${userId}`);
    return response.data;
  } catch (er) {
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};

export const getSearchedTracks = async (query: string) => {
  try {
    const response = await api.get("/api/tracks/search", {
      params: { q: query },
    });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};

interface lyricsCredentials{
  artist?:string,
  title?:string
}
export const getLyrics = async (credentials:lyricsCredentials)=>{
  try {
    const response = await api.post('/api/tracks/lyrics',credentials);
    return response.data
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.message);
  }
}