const BASE_URL = 'https://back-end-pro.vercel.app';

const apiService = {
  async fetchAllCountries() {
    const res = await fetch(`${BASE_URL}/countries`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    const data = await res.json();
    return data.countries;
  },

  async fetchCountryById(country_id) {
    const res = await fetch(`${BASE_URL}/countries`);
    if (!res.ok) throw new Error('Failed to fetch countries');
    const data = await res.json();
    return data.countries.find(c => c.country_id === country_id) ?? null;
  },
};

export default apiService;