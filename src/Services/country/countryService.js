import axios from "axios";

const API_URL = "https://back-end-pro.vercel.app";

const getToken = () => localStorage.getItem("landchoice_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getAllCountries = async () => {
  const res = await axios.get(`${API_URL}/countries`);
  return res.data.countries; 
};

export const getCountryById = async (countryId) => {
  const res = await axios.get(`${API_URL}/countries/id?country_id=${countryId}`, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const getCountryByName = async (name) => {
  const res = await axios.get(`${API_URL}/countries/name?name=${name}`, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const addCountry = async (countryData) => {
  const res = await axios.post(`${API_URL}/countries`, countryData, {
    headers: authHeaders(),
  });
  return res.data;
};

export const updateCountry = async (countryId, countryData) => {
  const res = await axios.put(
    `${API_URL}/countries?country_id=${countryId}`,
    countryData,
    {
      headers: authHeaders(),
    }
  );

  return res.data;
};
export const deleteCountry = async (countryId) => {
  const res = await axios.delete(`${API_URL}/countries?country_id=${countryId}`, {
    headers: authHeaders(),
  });
  return res.data;
};

export const deleteCountryByName = async (name) => {
  const res = await axios.delete(`${API_URL}/countries/name?name=${name}`, {
    headers: authHeaders(),
  });
  return res.data;
};