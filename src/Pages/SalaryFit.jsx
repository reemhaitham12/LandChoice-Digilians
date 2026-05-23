import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

import { useSalaryFit } from '../hooks/useSalaryFit';
import IncomeInput  from '../Components/salaryfit/IncomeInput';
import StatsRow     from '../Components/salaryfit/StatsRow';
import FiltersPanel from '../Components/salaryfit/FiltersPanel';
import ResultsList  from '../Components/salaryfit/ResultsList';

export default function SalaryFitChecker() {
  const {
    monthlyIncome, submitted, error, filters,
    results, stats, apiLoading,
    handleIncomeChange, handleCheck, updateFilter,
  } = useSalaryFit();

  const showResults = submitted && stats !== null;

  if (apiLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading country data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Salary <span className="text-primary">Fit</span>{' '}
            <span className="text-yellow-400">Checker</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Enter your monthly income and discover which digital nomad visas match your
            financial eligibility. Get instant insights on where you can relocate.
          </p>
        </motion.div>

        {/* Income card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-dark-800 border border-white/8 rounded-2xl p-8 mb-6"
        >
          <IncomeInput
            value={monthlyIncome}
            onChange={handleIncomeChange}
            onSubmit={handleCheck}
            error={error}
          />
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <>
              <StatsRow     stats={stats} />
              <FiltersPanel filters={filters} onChange={updateFilter} />
              <ResultsList  results={results} />
            </>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!showResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20" aria-live="polite">
            <FontAwesomeIcon icon={faChartLine} className="text-5xl text-slate-700 mb-4" />
            <p className="text-slate-500 text-base">Enter your monthly income to see which visas you qualify for</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
