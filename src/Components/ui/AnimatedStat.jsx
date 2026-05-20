import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AnimatedStat({ label, value, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-xl bg-dark-800 text-white"
    >
      <FontAwesomeIcon icon={icon} className="mb-2 text-slate-400" />
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-slate-400 uppercase tracking-wide mt-0.5">{label}</div>
    </motion.div>
  );
}
