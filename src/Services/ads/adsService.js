import axios from "axios";

const API_URL = "https://back-end-pro.vercel.app";

const getToken = () => localStorage.getItem("landchoice_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});


// Get All Ads (Admin)
export const getAllAds = async () => {
  const res = await axios.get(`${API_URL}/ads/admin/all`, {
    headers: authHeaders(),
  });
  
  console.log("Fetched Ads:", res.data.ads); // Debug log
  return res.data.ads; 
};


//  Create Ad
export const createAd = async (adData) => {
  const res = await axios.post(
    `${API_URL}/ads/admin/add-advertisement`,
    adData,
    { headers: authHeaders() }
  );

  return res.data;
};


//  Update Ad
export const updateAd = async (id, adData) => {
  const res = await axios.put(
    `${API_URL}/ads/admin/update-advertisement?id=${id}`,
    adData,
    { headers: authHeaders() }
  );

  return res.data;
};


//  Delete Ad
export const deleteAd = async (id) => {
  const res = await axios.delete(
    `${API_URL}/ads/admin/delete-advertisement?id=${id}`,
    { headers: authHeaders() }
  );

  return res.data;
};


//  Toggle Ad Status
export const toggleAdStatus = async (id) => {
  const res = await axios.patch(
    `${API_URL}/ads/admin/toggle?id=${id}`,
    {},
    { headers: authHeaders() }
  );

  return res.data;
};