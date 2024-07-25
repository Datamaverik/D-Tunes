import axios, { AxiosError } from "axios";

const baseURL = "http://localhost:5000";
const client_id = "HKEkBu-lR.2ZoPhz";
const redirect_uri = "http://localhost:5000/api/users/authenticate";

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
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/api/users/searchOne/${userId}`);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError)
      throw new AxiosError(er.response?.data.message);
  }
};

export interface signUpCredentials {
  username: string;
  password: string;
  email: string;
  isArtist?: boolean;
}

export const signUp = async (credentials: signUpCredentials) => {
  try {
    const response = await api.post("/api/users/signup", credentials);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
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
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/api/users/logout");
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const getLikedSongs = async () => {
  try {
    const response = await api.get("/api/users/likedSongs");
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
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
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};
interface updateBody {
  email?: string;
  isArtist?: boolean;
  passwordRaw?: string;
  image?: File;
}

export const updateUser = async (userId: string, credentials: updateBody) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users/update/${userId}`,
      credentials,
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
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};

export const getSearchedUsers = async (query: string) => {
  try {
    const response = await api.get("/api/users/search", {
      params: { q: query },
    });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/api/users/delete/${userId}`);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};

export const authenticate = async () => {
  try {
    const response = await axios.get("https://auth.delta.nitt.edu/authorize", {
      params: {
        client_id,
        redirect_uri,
        resoponse_type: "code",
        grant_type: "authorization_code",
        state: "qm2a@g5!ap&5#b",
        scope: "email+openid+profile+user",
        nonce: "qm2a@g5!ap&5#b",
      },
    });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};

export const pushTrack = async (songId: string) => {
  try {
    const response = await api.post(`/api/users/pushTrack`, {
      songId,
    });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};

export const pushPlaylist = async (playlistId: string) => {
  try {
    const response = await api.post(`/api/users/pushPlaylist`, {
      playlistId,
    });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.message);
  }
};
