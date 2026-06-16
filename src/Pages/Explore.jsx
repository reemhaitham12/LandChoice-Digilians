import { useState, useEffect, useMemo, forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faDollarSign,
  faClock,
  faStar,
  faArrowRight,
  faTimes,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "https://back-end-pro.vercel.app/countries";

const Explore = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [filters, setFilters] = useState({
    income: 10000,
    duration: 0,
    cost: 100,
    qol: 0,
    processing: "Any",
    search: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch all data once on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        // API returns { countries: [...] }
        setAllCountries(json.countries ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Client-side filtering based on filter state
  const countries = useMemo(() => {
    return allCountries.filter((c) => {
      // Max monthly income
      if (c.minIncomeMonthly > filters.income) return false;

      // Min visa duration (months)
      if (filters.duration > 0 && c.durationMonths < filters.duration)
        return false;

      // Max cost of living index
      if (c.costOfLivingIndex > filters.cost) return false;

      // Min quality of life
      if (filters.qol > 0 && c.qualityOfLife < filters.qol) return false;

      // Processing speed filter
      if (filters.processing === "Fastest" && c.processingWeeks > 4)
        return false;
      if (filters.processing === "Normal" && c.processingWeeks > 12)
        return false;

      // Search by country name or visa name
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        if (
          !c.country.toLowerCase().includes(q) &&
          !c.visaName.toLowerCase().includes(q)
        )
          return false;
      }

      return true;
    });
  }, [allCountries, filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      income: 10000,
      duration: 0,
      cost: 100,
      qol: 0,
      processing: "Any",
      search: "",
    });
  };

  return (
    <div className="pt-24 min-h-screen bg-dark-900">
      <div className="max-w-[1600px] mx-auto px-6 pb-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:w-80 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? "block" : "hidden lg:block"}`}
        >
          <div className="glass-card p-6 rounded-3xl sticky top-28 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <FontAwesomeIcon icon={faFilter} className="text-primary" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs text-primary-light hover:underline font-medium"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-8">
              {/* Monthly Income Slider */}
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-semibold text-white">
                    Max Monthly Income
                  </label>
                  <span className="text-primary-light font-bold">
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
                    updateFilter("income", parseInt(e.target.value))
                  }
                  className="w-full accent-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>$0</span>
                  <span>$10k+</span>
                </div>
              </div>

              {/* Visa Duration Dropdown */}
              <div>
                <label className="text-sm font-semibold text-white block mb-3">
                  Min Visa Duration
                </label>
                <div className="relative">
                  <select
                    value={filters.duration}
                    onChange={(e) =>
                      updateFilter("duration", parseInt(e.target.value))
                    }
                    className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value={0} className="text-black">Any duration</option>
                    <option value={6} className="text-black">6+ Months</option>
                    <option value={12} className="text-black">1+ Year</option>
                    <option value={24} className="text-black">2+ Years</option>
                  </select>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="absolute right-4 top-4 text-slate-500 pointer-events-none text-xs"
                  />
                </div>
              </div>


              {/* Processing Time */}
              <div>
                <label className="text-sm font-semibold text-white block mb-3">
                  Processing Speed
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Any", "Fastest", "Normal"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateFilter("processing", mode)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${filters.processing === mode
                        ? "bg-primary/20 text-primary-light border-primary/40"
                        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
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

        {/* Main Content Area */}
        <main className="flex-grow">
          {/* Header & Search */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-display font-extrabold text-white mb-2">
                Explore <span className="gradient-text">Destinations</span>
              </h1>
              <p className="text-slate-400 text-sm">
                {loading
                  ? "Loading countries…"
                  : `Showing ${countries.length} of ${allCountries.length} countries matching your criteria`}
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
                onChange={(e) => updateFilter("search", e.target.value)}
                className="w-full bg-dark-800/80 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-xl"
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
              Failed to load countries: {error}
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
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
                  <CountryCard key={country._id} country={country} />
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
                    className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-transform"
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
};

const CountryCard = forwardRef(({ country }, ref) => {
  return (
    <motion.div
      ref={ref}
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
            <h3 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors">
              {country.country}
            </h3>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              {country.visaName}
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
            <FontAwesomeIcon icon={faStar} className="text-[10px]" />
            <span className="text-xs font-bold">{country.qualityOfLife}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-1">
              <FontAwesomeIcon icon={faDollarSign} /> Income
            </div>
            <div className="text-white font-bold">
              {country.currencySymbol}
              {country.minIncomeMonthly.toLocaleString()}
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase mb-1">
              <FontAwesomeIcon icon={faClock} /> Duration
            </div>
            <div className="text-white font-bold">
              {country.durationMonths} Months
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Cost of Living</span>
            <span className="text-white font-medium">
              {country.costOfLivingIndex} Index
            </span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${country.costOfLivingIndex}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${country.difficulty === "Easy"
              ? "bg-green-400"
              : country.difficulty === "Medium"
                ? "bg-yellow-400"
                : "bg-red-400"
              }`}
          />
          <span className="text-xs text-slate-300 font-medium">
            {country.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/compare?add=${country.country_id}`}
            className="text-slate-400 text-xs font-bold hover:text-white transition-colors"
          >
            Compare
          </Link>
          <Link
            to={`/country/${country.country_id}`}
            className="text-primary-light text-xs font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all"
          >
            Details <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

CountryCard.displayName = "CountryCard";

export default Explore;
