import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle, faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import comparisonService from '../../Services/comparisonService';
import { THRESHOLDS } from '../../hooks/useSalaryFit';

function getStatusIcon(status) {
  switch (status) {
    case 'Eligible':     return <FontAwesomeIcon icon={faCheckCircle}       className="w-5 h-5 text-green-400" />;
    case 'Close':        return <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 text-yellow-400" />;
    case 'Not Eligible': return <FontAwesomeIcon icon={faTimesCircle}       className="w-5 h-5 text-red-400" />;
    default:             return null;
  }
}

function getStatusColor(status) {
  return {
    'Eligible':     'border-green-500/30 bg-green-500/10',
    'Close':        'border-yellow-500/30 bg-yellow-500/10',
    'Not Eligible': 'border-red-500/30 bg-red-500/10',
  }[status] ?? 'border-white/10';
}

function getDifficultyColor(difficulty) {
  return {
    'Easy':   'bg-green-500/20 text-green-400',
    'Medium': 'bg-yellow-500/20 text-yellow-400',
    'Hard':   'bg-red-500/20 text-red-400',
  }[difficulty] ?? '';
}

function getProgressBarColor(percentage) {
  if (percentage >= THRESHOLDS.ELIGIBLE) return 'bg-green-500';
  if (percentage >= THRESHOLDS.CLOSE)    return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function ResultCard({ result, index }) {
  const costText = comparisonService.getCostOfLivingText(result.additionalInfo.costOfLiving);

  return (
    <motion.article
      key={result.countryId}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass-card p-6 rounded-2xl border ${getStatusColor(result.status)}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-grow">

          {/* Header row */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            {getStatusIcon(result.status)}
            <h3 className="text-xl font-bold text-white">{result.country}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              result.status === 'Eligible'     ? 'bg-green-500/20 text-green-400' :
              result.status === 'Close'        ? 'bg-yellow-500/20 text-yellow-400' :
                                                 'bg-red-500/20 text-red-400'
            }`}>{result.status}</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(result.additionalInfo.difficulty)}`}>
              {result.additionalInfo.difficulty}
            </span>
          </div>

          <p className="text-slate-400 text-sm mb-3">{result.visaName}</p>

          {/* Progress bar */}
          <div className="mb-3" role="meter" aria-valuenow={result.percentage} aria-valuemin={0} aria-valuemax={100} aria-label="Income match percentage">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Income Match</span>
              <span className="text-white font-bold">{result.percentage}%</span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${getProgressBarColor(result.percentage)} transition-all`}
                style={{ width: `${Math.min(result.percentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Details grid */}
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              { label: 'Required',       value: result.requiredOriginal },
              { label: 'Your Income',    value: `$${result.userIncome.toLocaleString()}` },
              { label: 'Processing',     value: result.additionalInfo.processingTime },
              { label: 'Cost of Living', value: `${costText} (${result.additionalInfo.costOfLiving})` }, // ✅ Fix 3: human-readable
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-slate-500 text-xs">{label}</dt>
                <dd className="text-white font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Message */}
          <div className="mt-4 p-4 bg-dark-900/50 rounded-xl border border-white/5">
            <p className="text-white text-sm font-medium mb-2">{result.message}</p>
            <p className="text-slate-400 text-xs">{result.recommendation}</p>
          </div>

        </div>
      </div>
    </motion.article>
  );
}
