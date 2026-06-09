import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import ResultCard from './ResultCard';

export default function ResultsList({ results }) {
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 bg-dark-800 border border-white/8 rounded-2xl"
        role="status"
      >
        <FontAwesomeIcon icon={faFilter} className="text-4xl text-slate-600 mb-4" />
        <p className="text-slate-400 text-base">No countries match your current filters.</p>
        <p className="text-slate-500 text-sm mt-1">Try adjusting your filter settings.</p>
      </motion.div>
    );
  }

  return (
    <section aria-label="Country results">
      {results.map((result, index) => (
        <ResultCard key={result.countryId} result={result} index={index} />
      ))}
    </section>
  );
}
