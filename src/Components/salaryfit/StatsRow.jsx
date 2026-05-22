import { motion } from 'framer-motion';

const STAT_CONFIGS = [
  { key: 'total',       label: 'Countries Analyzed', cls: 'border-white/10',                          num: 'text-white' },
  { key: 'eligible',    label: 'Eligible Visas',     cls: 'border-green-500/30 bg-green-500/5',        num: 'text-green-400' },
  { key: 'close',       label: 'Close Matches',      cls: 'border-yellow-500/30 bg-yellow-500/5',      num: 'text-yellow-400' },
  { key: 'notEligible', label: 'Not Eligible',       cls: 'border-red-500/30 bg-red-500/5',            num: 'text-red-400' },
];

export default function StatsRow({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      role="region" aria-label="Eligibility summary"
    >
      {STAT_CONFIGS.map(({ key, label, cls, num }) => (
        <div key={key} className={`glass-card p-6 rounded-2xl border ${cls}`}>
          <div className={`text-3xl font-bold mb-1 ${num}`}>{stats[key]}</div>
          <div className="text-slate-400 text-sm">{label}</div>
        </div>
      ))}
    </motion.div>
  );
}
