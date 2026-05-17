import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faSearch,
  faDollarSign,
  faClock,
  faStar,
  faArrowRight,
  faTimes,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import apiService from '../service/apiService';

export default function Explore() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    income: 5000,
    duration: 0,
    cost: 100,
    qol: 0,
    processing: 'Any',
    search: '',
  });

  const [isSidebarOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const data = await apiService.fetchCountries(filters);
        setCountries(data);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadData, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      income: 5000,
      duration: 0,
      cost: 100,
      qol: 0,
      processing: 'Any',
      search: '',
    });
  };

  return (
    <div className="pt-32 min-h-screen bg-slate-950">
      <div className="max-w-[1600px] mx-auto px-6 pb-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside
          className={`lg:w-80 flex-shrink-0 transition-all duration-300 ${
            isSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="glass-card p-6 rounded-3xl sticky top-28 border border-white/10 shadow-xl">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <FontAwesomeIcon
                  icon={faFilter}
                  className="text-blue-400"
                />
                <span>Filters</span>
              </div>

              <button
                onClick={resetFilters}
                className="text-xs text-blue-400 hover:underline font-medium"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-8">

              {/* Income */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-semibold text-white">
                    Max Monthly Income
                  </label>

                  <span className="text-blue-400 font-bold">
                    ${filters.income.toLocaleString()}
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={filters.income}
                  onChange={(e) =>
                    updateFilter('income', parseInt(e.target.value))
                  }
                  className="w-full h-1.5 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>$0</span>
                  <span>$10k+</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-semibold text-white block mb-3">
                  Min Visa Duration
                </label>

                <div className="relative">
                  <select
                    value={filters.duration}
                    onChange={(e) =>
                      updateFilter('duration', parseInt(e.target.value))
                    }
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                  >
                    <option value={0}>Any duration</option>
                    <option value={6}>6+ Months</option>
                    <option value={12}>1+ Year</option>
                    <option value={24}>2+ Years</option>
                  </select>

                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="absolute right-4 top-4 text-slate-500 pointer-events-none text-xs"
                  />
                </div>
              </div>

              {/* Cost */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-semibold text-white">
                    Max Cost of Living
                  </label>

                  <span className="text-blue-400 font-bold">
                    {filters.cost}
                  </span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={filters.cost}
                  onChange={(e) =>
                    updateFilter('cost', parseInt(e.target.value))
                  }
                  className="w-full h-1.5 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Cheap</span>
                  <span>Expensive</span>
                </div>
              </div>

              {/* Quality */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-semibold text-white">
                    Min Quality of Life
                  </label>

                  <span className="text-blue-400 font-bold">
                    {filters.qol}+
                  </span>
                </div>

                <div className="flex gap-2">
                  {[0, 6, 7, 8, 9].map((val) => (
                    <button
                      key={val}
                      onClick={() => updateFilter('qol', val)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                        filters.qol === val
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {val === 0 ? 'All' : val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Processing */}
              <div>
                <label className="text-sm font-semibold text-white block mb-3">
                  Processing Speed
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {['Any', 'Fastest', 'Normal'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateFilter('processing', mode)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        filters.processing === mode
                          ? 'bg-blue-500/20 text-blue-400 border-blue-400/40'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-grow">
          
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Explore{' '}
                <span className="gradient-text">
                  Destinations
                </span>
              </h1>

              <p className="text-slate-400 text-sm">
                Showing {countries.length} countries matching your criteria
              </p>
            </div>

            <div className="relative w-full md:w-96">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-4 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search by country or visa..."
                value={filters.search}
                onChange={(e) =>
                  updateFilter('search', e.target.value)
                }
                className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all shadow-xl"
              />
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            <AnimatePresence>

              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <motion.div
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-80 rounded-3xl bg-white/5 animate-pulse"
                    />
                  ))
              ) : countries.length > 0 ? (

                countries.map((country) => (
                  <CountryCard
                    key={country.id}
                    country={country}
                  />
                ))

              ) : (

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-slate-600 text-3xl"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    No countries found
                  </h3>

                  <p className="text-slate-400 max-w-xs mx-auto">
                    Try adjusting your filters to see more results.
                  </p>

                  <button
                    onClick={resetFilters}
                    className="mt-6 px-6 py-2.5 bg-blue-500 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

const CountryCard = ({ country }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="glass-card rounded-3xl overflow-hidden flex flex-col h-full border border-white/5 group"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          
          <div>
            <h3 className="text-2xl font-bold text-white">
              {country.country}
            </h3>

            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              {country.visaName}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
            <FontAwesomeIcon icon={faStar} className="text-[10px]" />
            <span className="text-xs font-bold">
              {country.qualityOfLife}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};