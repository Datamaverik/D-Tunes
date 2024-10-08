import axios from "axios";

const baseURL = "http://localhost:5000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getGenres = async () => {
  try {
    const response = await api.get("/api/songs/genres");
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const getPlaylists = async (genreId: string) => {
  try {
    const response = await api.get(`/api/songs/genres/${genreId}`);
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const getTracksOfPlaylist = async (playlistId: string) => {
  try {
    const response = await api.get(`/api/songs/playlists/${playlistId}`);
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const getTrack = async (trackId: string) => {
  try {
    const response = await api.get(`/api/songs/playlist/${trackId}`);
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const getAccessToken = async () => {
  try {
    const response = await api.get("/api/songs/access-token");
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const getSerchedSongs = async (query: string) => {
  try {
    const response = await api.get("/api/songs/search", {
      params: { q: query },
    });
    return response.data;
  } catch (er) {
    console.error(er);
  }
};

export const getPlaylistById = async (playlistId: string) => {
  try {
    const response = await api.get(`/api/songs/playlistById/${playlistId}`);
    return response.data;
  } catch (er) {
    console.error(er);
  }
};
