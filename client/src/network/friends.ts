import axios, { AxiosError } from "axios";

const baseURL = "http://localhost:5000";
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllFriends = async (userId: string) => {
  try {
    const response = await api.get(`/api/friends/${userId}`);
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const addFriendReq = async (userA: string, userB: string) => {
  try {
    const response = await api.post("/api/friends/sendReq", { userA, userB });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const rejectFriendReq = async (userA: string, userB: string) => {
  try {
    const response = await api.post("/api/friends/rejectReq", { userA, userB });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const acceptFriendReq = async (userA: string, userB: string) => {
  try {
    const response = await api.post("/api/friends/acceptReq", { userA, userB });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};

export const removeFriend = async (userA: string, userB: string) => {
  try {
    const response = await api.post("/api/friends/removeFriend", {
      userA,
      userB,
    });
    return response.data;
  } catch (er) {
    console.error(er);
    if (er instanceof AxiosError) throw new Error(er.response?.data.message);
  }
};
