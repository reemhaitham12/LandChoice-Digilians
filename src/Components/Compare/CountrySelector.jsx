import React, { useState, useMemo } from 'react';
import { Search, Plus, X } from 'lucide-react';

const CountrySelector = ({
  countries,
  onSelect,
  selectedCountries,
  onRemove,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return [];

    return countries.filter(
      (country) =>
        !selectedCountries.some(
          (c) => c.country_id === country.country_id
        ) &&
        country.country
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [countries, searchTerm, selectedCountries]);

  const handleSelect = (country) => {
    onSelect(country);
    setSearchTerm('');
    setIsOpen(false);
  };

  const isDisabled = selectedCountries.length >= 4;

  return (
    <div>
      {/* Selected Countries */}
      {selectedCountries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCountries.map((country) => (
            <div
              key={country.country_id}
              className="
                flex items-center gap-2
                bg-[#6C8FD9]/10
                border border-[#6C8FD9]/20
                text-[#6C8FD9]
                px-3 py-1.5
                rounded-lg
                text-sm
              "
            >
              <span>{country.country}</span>

              <button
                onClick={() => onRemove(country.country_id)}
                className="text-[#6C8FD9] hover:text-red-400 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder={
            isDisabled
              ? 'Maximum 4 countries selected'
              : 'Search for a country...'
          }
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={isDisabled}
          className="
            w-full
            px-4
            py-3
            pr-10
            bg-[#020817]
            text-white
            placeholder-gray-500
            border border-[#6C8FD9]/20
            rounded-xl
            focus:outline-none
            focus:ring-2
            focus:ring-[#6C8FD9]/40
            focus:border-[#6C8FD9]
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        />

        <Search
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-[#6C8FD9]
            w-5
            h-5
          "
        />

        {/* Dropdown */}
        {isOpen &&
          searchTerm &&
          filteredCountries.length > 0 && (
            <div
              className="
                absolute
                z-10
                w-full
                mt-2
                bg-[#0F172A]
                border border-[#6C8FD9]/20
                rounded-xl
                shadow-xl
                overflow-hidden
                max-h-72
                overflow-y-auto
              "
            >
              {filteredCountries.map((country) => (
                <button
                  key={country.country_id}
                  onClick={() => handleSelect(country)}
                  className="
                    w-full
                    px-4
                    py-3
                    text-left
                    hover:bg-[#6C8FD9]/10
                    transition
                    flex
                    justify-between
                    items-center
                    border-b
                    border-white/5
                    last:border-0
                  "
                >
                  <div>
                    <div className="font-medium text-white">
                      {country.country}
                    </div>

                    <div className="text-sm text-gray-400">
                      {country.visaName}
                    </div>
                  </div>

                  <Plus className="w-4 h-4 text-[#6C8FD9]" />
                </button>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default CountrySelector;