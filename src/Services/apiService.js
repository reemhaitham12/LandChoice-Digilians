const  API_BASE_URL = import.meta.env.VITE_API_URL; 

const apiService = {
  async fetchAllCountries() {
    const res = await fetch(`${API_BASE_URL}/countries`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    const data = await res.json();
    return data.countries;
  },

  async fetchCountryById(country_id) {
    const res = await fetch(`${API_BASE_URL}/countries`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    const data = await res.json();
    return data.countries.find(c => c.country_id === country_id) ?? null;
  },
};

export default apiService;