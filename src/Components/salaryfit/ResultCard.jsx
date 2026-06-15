import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { THRESHOLDS } from '../../hooks/useSalaryFit';

function getStatusIcon(status) {
  switch (status) {
    case 'Eligible':     return <FontAwesomeIcon icon={faCheckCircle}       className="text-green-400 text-lg" />;
    case 'Close':        return <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-400 text-lg" />;
    case 'Not Eligible': return <FontAwesomeIcon icon={faTimesCircle}       className="text-red-400 text-lg" />;
    default:             return null;
  }
}

function statusBadgeClass(status) {
  return {
    'Eligible':     'bg-green-500/20 text-green-400 border border-green-500/30',
    'Close':        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    'Not Eligible': 'bg-red-500/20 text-red-400 border border-red-500/30',
  }[status] ?? '';
}

function difficultyBadgeClass(d) {
  return {
    Easy:   'bg-green-500/20 text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    Hard:   'bg-red-500/20 text-red-400',
  }[d] ?? 'bg-slate-500/20 text-slate-400';
}

function barColor(pct) {
  if (pct >= THRESHOLDS.ELIGIBLE) return 'bg-green-500';
  if (pct >= THRESHOLDS.CLOSE)    return 'bg-yellow-500';
  return 'bg-red-500';
}

function cardBorderColor(status) {
  return {
    'Eligible':     'border-white/8',
    'Close':        'border-yellow-500/20',
    'Not Eligible': 'border-red-500/20',
  }[status] ?? 'border-white/8';
}

export default function ResultCard({ result, index }) {
  const pct = Math.min(result.percentage, 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-dark-800 border ${cardBorderColor(result.status)} rounded-2xl p-6 mb-4`}
    >
      {/* Top row: flag-circle icon + country name + badges */}
      <div className="flex items-center gap-3 mb-1 flex-wrap">
        {getStatusIcon(result.status)}
        <h3 className="text-xl font-bold text-white">{result.country}</h3>
        <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${statusBadgeClass(result.status)}`}>
          {result.status}
        </span>
        <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${difficultyBadgeClass(result.additionalInfo.difficulty)}`}>
          {result.additionalInfo.difficulty}
        </span>
      </div>

      {/* Visa name */}
      <p className="text-slate-400 text-sm mb-4">{result.visaName}</p>

      {/* Progress bar */}
      <div className="mb-5">
  <div className="flex justify-between text-xs mb-1.5">
    <span className="text-slate-400">Income Match</span>
    <span className="text-white font-bold">{pct}%</span>
  </div>

  <div className="w-full h-2 bg-dark-900 rounded-full overflow-hidden">
    <motion.div
      className={`h-full ${barColor(pct)} rounded-full`}
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{
        duration: 0.8,
        ease: 'easeOut',
        delay: index * 0.04 + 0.2
      }}
    />
  </div>
</div>

      {/* 4-col details */}
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Required',       value: result.requiredOriginal },
          { label: 'Your Income',    value: `$${result.userIncome.toLocaleString()}` },
          { label: 'Processing',     value: result.additionalInfo.processingTime },
          { label: 'Cost of Living', value: result.additionalInfo.costOfLiving },
        ].map(({ label, value }) => (
          <div key={label}>
            <dt className="text-slate-500 text-xs mb-0.5">{label}</dt>
            <dd className="text-white font-bold text-sm">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Message box */}
      <div className="bg-dark-900/70 border border-white/5 rounded-xl px-5 py-4">
        <p className="text-white text-sm font-semibold mb-1">{result.message}</p>
        <p className="text-slate-400 text-xs leading-relaxed">{result.recommendation}</p>
      </div>
    </motion.article>
  );
}
