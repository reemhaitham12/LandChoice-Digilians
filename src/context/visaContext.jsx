import { createContext, useContext, useEffect, useState } from "react";

const VisaContext = createContext();

export function VisaProvider({ children }) {
  const [visaData, setVisaData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/countries`);
        const data = await res.json();

        const countries = data?.countries || [];

        const formattedData = countries.map((country) => ({
          ...country,
          id: country.country_id || country._id,
        }));

        setVisaData(formattedData);
      } catch (err) {
        setVisaData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <VisaContext.Provider value={{ visaData, loading }}>
      {children}
    </VisaContext.Provider>
  );
}

export function useVisa() {
  return useContext(VisaContext);
}