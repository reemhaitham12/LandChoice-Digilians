import { motion } from 'framer-motion';

const CONFIGS = [
  { key: 'total',       label: 'Countries Analyzed', color: 'text-white'        },
  { key: 'eligible',    label: 'Eligible Visas',     color: 'text-green-400'    },
  { key: 'close',       label: 'Close Matches',      color: 'text-yellow-400'   },
  { key: 'notEligible', label: 'Not Eligible',       color: 'text-red-400'      },
];

export default function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {CONFIGS.map(({ key, label, color }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-dark-800 border border-white/8 rounded-2xl p-6"
        >
          <div className={`text-4xl font-bold mb-1 ${color}`}>{stats[key]}</div>
          <div className="text-slate-400 text-sm">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}