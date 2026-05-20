import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

import { useSalaryFit } from '../hooks/useSalaryFit';
import IncomeInput  from '../Components/salaryfit/IncomeInput';
import StatsRow     from '../Components/salaryfit/StatsRow';
import FiltersPanel from '../Components/salaryfit/FiltersPanel';
import ResultsList  from '../Components/salaryfit/ResultsList';

const SalaryFitChecker = () => {
  const {
    monthlyIncome,
    submitted,
    error,
    filters,
    results,
    stats,
    handleIncomeChange,
    handleCheck,
    updateFilter,
  } = useSalaryFit();

  const showResults = submitted && stats !== null;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 mb-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Salary <span className="gradient-text">Fit Checker</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Enter your monthly income and discover which digital nomad visas match your financial eligibility.
        </p>
      </motion.div>

      {/* Income input card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 md:p-12 rounded-3xl mb-8"
      >
        <IncomeInput
          value={monthlyIncome}
          onChange={handleIncomeChange}
          onSubmit={handleCheck}
          error={error}
        />
      </motion.div>

      {/* Results section */}
      <AnimatePresence>
        {showResults && (
          <>
            <StatsRow stats={stats} />
            <FiltersPanel filters={filters} onChange={updateFilter} />
            <ResultsList results={results} />
          </>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!showResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
          aria-live="polite"
        >
          <FontAwesomeIcon icon={faChartLine} className="w-16 h-16 text-slate-600 mx-auto mb-4" aria-hidden="true" />
          <p className="text-slate-400 text-lg">Enter your monthly income to see which visas you qualify for</p>
        </motion.div>
      )}

    </div>
  );
};

export default SalaryFitChecker;
