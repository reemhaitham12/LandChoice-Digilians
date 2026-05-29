import { createContext, useContext, useEffect, useState } from "react";

const VisaContext = createContext();

export function VisaProvider({ children }) {
  const [visaData, setVisaData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/countries")
      .then((res) => res.json())
      .then((data) => {
         // console.log("API DATA:", data);

        const countries = Array.isArray(data)
          ? data
          : Array.isArray(data.countries)
            ? data.countries
            : [];

        const formattedData = countries.map((country) => ({
          ...country,
          id: country.country_id,
        }));

        setVisaData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setVisaData([]);
        setLoading(false);
      });
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