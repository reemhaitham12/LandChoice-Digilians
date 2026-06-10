import axios from "axios";

const API_URL = "https://back-end-pro.vercel.app";
const getToken = () => localStorage.getItem("landchoice_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getAllUsers = async () => {
  const res = await axios.get(`${API_URL}/admin/regular-users`, { headers: authHeaders() });
  return res.data;
};

export const getAllAdmins = async () => {
  const res = await axios.get(`${API_URL}/admin/admins`, { headers: authHeaders() });
  return res.data;
};

export const getRegularUsers = async () => {
  const res = await axios.get(`${API_URL}/admin/regular-users`, { headers: authHeaders() });
  return res.data;
};

export const promoteUserToAdmin = async (email) => {
  const res = await axios.post(`${API_URL}/admin/promote-to-admin`, { email }, { headers: authHeaders() });
  return res.data;
};

export const demoteAdminToUser = async (email) => {
  const res = await axios.post(`${API_URL}/admin/demote-to-user`, { email }, { headers: authHeaders() });
  return res.data;
};

export const deleteUser = async (email) => {
  const res = await axios.delete(`${API_URL}/admin/delete-user`, { headers: authHeaders(), data: { email } });
  return res.data;
};