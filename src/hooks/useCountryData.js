import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllCountries } from '../Services/countryService';

export const useCountryData = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const data = await getAllCountries();
        const countries = data.countries || [];
        setAllCountries(countries);

        // ✅ لو في ?add=country_id في الـ URL، ابحث عن الدولة وأضفها
        const addId = searchParams.get('add');
        if (addId) {
          const country = countries.find(
            (c) => c.country_id === addId || c._id === addId
          );
          if (country) {
            setSelectedCountries([country]);
          }
          // امسح الـ param من الـ URL بعد ما تضيف الدولة
          setSearchParams({});
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addCountry = useCallback((country) => {
    setSelectedCountries((prev) => {
      if (prev.length >= 4) {
        setError('You can compare up to 4 countries only');
        return prev;
      }
      if (prev.find((c) => c.country_id === country.country_id)) {
        setError('This country is already selected');
        return prev;
      }
      setError(null);
      return [...prev, country];
    });
  }, []);

  const removeCountry = useCallback((countryId) => {
    setSelectedCountries((prev) =>
      prev.filter((c) => c.country_id !== countryId)
    );
    setError(null);
  }, []);

  const clearAll = useCallback(() => {
    setSelectedCountries([]);
    setError(null);
  }, []);

  return {
    allCountries,
    selectedCountries,
    loading,
    error,
    addCountry,
    removeCountry,
    clearAll,
    canAddMore: selectedCountries.length < 4,
  };
};