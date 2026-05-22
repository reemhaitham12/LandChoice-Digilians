import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import ResultCard from './ResultCard';

export default function ResultsList({ results }) {
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 glass-card rounded-2xl"
        role="status"
      >
        <FontAwesomeIcon icon={faFilter} className="w-16 h-16 text-slate-600 mx-auto mb-4" aria-hidden="true" />
        <p className="text-slate-400 text-lg">No countries match your current filters.</p>
        <p className="text-slate-500 text-sm mt-2">Try adjusting your filter settings.</p>
      </motion.div>
    );
  }

  return (
    <section aria-label="Country results" className="space-y-4">
      {results.map((result, index) => (
        <ResultCard key={result.countryId} result={result} index={index} />
      ))}
    </section>
  );
}
