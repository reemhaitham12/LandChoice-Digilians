const BASE_URL = "http://localhost:5000/api";

const apiService = {
  async fetchCountries(filters = {}) {
    try {
      const params = new URLSearchParams();

      // دايماً ابعت income
      params.set("income", filters.income);

      if (filters.duration > 0) {
        params.set("duration", filters.duration);
      }

      if (filters.cost < 100) {
        params.set("cost", filters.cost);
      }

      if (filters.qol > 0) {
        params.set("qol", filters.qol);
      }

      if (filters.processing && filters.processing !== "Any") {
        params.set("processing", filters.processing);
      }

      if (filters.search?.trim()) {
        params.set("search", filters.search.trim());
      }

      const res = await fetch(`${BASE_URL}/countries?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      console.log("API Response:", json);

      return (json.data || []).map((country) => ({
        ...country,
        id: country._id,
      }));
    } catch (err) {
      console.error("apiService.fetchCountries error:", err);
      return [];
    }
  },

  async fetchCountryById(id) {
    try {
      const res = await fetch(`${BASE_URL}/countries/${id}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const json = await res.json();

      return json.data
        ? {
            ...json.data,
            id: json.data._id,
          }
        : null;
    } catch (err) {
      console.error("apiService.fetchCountryById error:", err);
      return null;
    }
  },
};

export default apiService;