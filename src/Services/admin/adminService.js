import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getAllAdmins = async () => {
  try {
    const res = await api.get("/admin/admins");

    console.log("FULL RESPONSE:", res);
    console.log("RESPONSE DATA:", res.data);

    return res.data.admins || [];
  } catch (error) {
    console.error("GET ADMINS ERROR:", error);

    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("ERROR DATA:", error.response.data);
    }

    return [];
  }
};