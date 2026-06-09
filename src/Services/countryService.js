import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://back-end-pro.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Get all countries
export const getAllCountries = async () => {
  try {
    const response = await api.get('/countries');
    return response.data; // { countries: [...] }
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export default { getAllCountries };