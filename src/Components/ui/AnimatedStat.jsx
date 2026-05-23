import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AnimatedStat({ label, value, icon, color, unit = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-2 border border-white/5 group hover:border-white/20 transition-all"
    >
      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
        <FontAwesomeIcon icon={icon} style={{ color }} />
        {label}
      </div>
      <div className="text-2xl font-extrabold font-display text-white">
        {value}<span className="text-lg text-slate-400 font-normal ml-1">{unit}</span>
      </div>
    </motion.div>
  );
}