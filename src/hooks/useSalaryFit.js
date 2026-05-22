import { useState, useMemo, useCallback } from 'react';
import { useVisa } from '../context/visaContext';
import comparisonService from '../Services/comparisonService';

export const THRESHOLDS = { ELIGIBLE: 100, CLOSE: 80 };

export const DEFAULT_FILTERS = {
  showEligible:    true,
  showClose:       true,
  showNotEligible: false,
  difficulty:      'all',
  sortBy:          'status',
};

export function useSalaryFit() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [submitted, setSubmitted]         = useState(false);
  const [error, setError]                 = useState(null);
  const [filters, setFilters]             = useState(DEFAULT_FILTERS);

  // ✅ Use shared context — no duplicate fetch
  const { visaData, loading: apiLoading } = useVisa();

  const countries = Array.isArray(visaData)
    ? visaData
    : Array.isArray(visaData?.countries)
    ? visaData.countries
    : [];

  const allResults = useMemo(() => {
    if (!monthlyIncome || Number(monthlyIncome) <= 0 || !countries.length) return [];
    try {
      return comparisonService.checkAllCountries(Number(monthlyIncome), countries);
    } catch {
      return [];
    }
  }, [monthlyIncome, countries]);

  const results = useMemo(() => {
    let filtered = allResults.filter(r => {
      if (r.status === 'Eligible'     && !filters.showEligible)    return false;
      if (r.status === 'Close'        && !filters.showClose)        return false;
      if (r.status === 'Not Eligible' && !filters.showNotEligible)  return false;
      if (filters.difficulty !== 'all' && r.additionalInfo.difficulty !== filters.difficulty) return false;
      return true;
    });
    if (filters.sortBy === 'income')       filtered.sort((a, b) => a.required - b.required);
    if (filters.sortBy === 'costOfLiving') filtered.sort((a, b) => a.additionalInfo.costOfLiving - b.additionalInfo.costOfLiving);
    return filtered;
  }, [allResults, filters]);

  const stats = useMemo(() => {
    if (!allResults.length) return null;
    return {
      total:       allResults.length,
      eligible:    allResults.filter(r => r.status === 'Eligible').length,
      close:       allResults.filter(r => r.status === 'Close').length,
      notEligible: allResults.filter(r => r.status === 'Not Eligible').length,
    };
  }, [allResults]);

  const handleIncomeChange = useCallback(e => {
    setMonthlyIncome(e.target.value);
    setError(null);
  }, []);

  const handleCheck = useCallback(e => {
    e.preventDefault();
    if (!monthlyIncome || Number(monthlyIncome) <= 0) {
      setError('Please enter a valid monthly income.');
      return;
    }
    setSubmitted(true);
  }, [monthlyIncome]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    monthlyIncome, submitted, error, filters,
    results, stats, apiLoading,
    handleIncomeChange, handleCheck, updateFilter,
  };
}
