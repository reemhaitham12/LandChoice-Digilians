import React from 'react';
import { Info } from 'lucide-react';
import { useCountryData } from '../hooks/useCountryData';
import CountrySelector from '../Components/Compare/CountrySelector';
import Highlights from '../Components/Compare/Highlights';
import ComparisonCard from '../Components/Compare/ComparisonCard';
import ComparisonTable from '../Components/Compare/ComparisonTable';

const Compare = () => {
  const {
    allCountries,
    selectedCountries,
    loading,
    error,
    addCountry,
    removeCountry,
    clearAll,
  } = useCountryData();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <div className="text-[#6C8FD9] text-lg font-medium">
          Loading countries...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] py-12 px-4 text-white">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-[#6C8FD9] bg-[#6C8FD9]/10 border border-[#6C8FD9]/20 rounded-full mb-6">
            VISA COMPARISON
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Compare{' '}
            <span className="bg-gradient-to-r from-[#6C8FD9] to-[#f29706] bg-clip-text text-transparent">
              Countries
            </span>
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Compare visa requirements, costs, income thresholds, and lifestyle
            factors across multiple destinations to find the perfect fit for
            your remote work journey.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            {error}
          </div>
        )}

        {/* Country Selector */}
        <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#6C8FD9] font-medium">
              Select Countries to Compare ({selectedCountries.length}/4)
            </h2>

            {selectedCountries.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                Clear All
              </button>
            )}
          </div>

          <CountrySelector
            countries={allCountries}
            onSelect={addCountry}
            selectedCountries={selectedCountries}
            onRemove={removeCountry}
          />
        </div>

        {/* Empty State */}
        {selectedCountries.length === 0 ? (
          <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-gray-400">
              Select countries to start comparing
            </p>
          </div>
        ) : (
          <>
            <Highlights countries={selectedCountries} />

            {/* Cards */}
            <div className="mb-10">
              {selectedCountries.map((country) => (
                <ComparisonCard
                  key={country.country_id}
                  country={country}
                />
              ))}
            </div>

            {/* Table */}
            {selectedCountries.length >= 2 && (
              <div className="mb-8">
                <ComparisonTable countries={selectedCountries} />
              </div>
            )}

            {/* Info Note */}
            {/* <div className="bg-[#0F172A] border border-[#6C8FD9]/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#6C8FD9] mt-0.5 shrink-0" />

                <p className="text-sm text-gray-400">
                  Data is based on official visa requirements and cost of
                  living indices. Figures may change over time and should be
                  verified with official government immigration sources before
                  making relocation decisions.
                </p>
              </div>
            </div> */}
          </>
        )}

      </div>
    </div>
  );
};

export default Compare;