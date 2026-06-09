import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';

const STATUS_FILTERS = [
  { id: 'f-eligible', key: 'showEligible',    label: 'Eligible',      accent: 'accent-green-500'  },
  { id: 'f-close',    key: 'showClose',       label: 'Close',         accent: 'accent-yellow-500' },
  { id: 'f-not',      key: 'showNotEligible', label: 'Not Eligible',  accent: 'accent-red-500'    },
];

export default function FiltersPanel({ filters, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="glass-card p-6 rounded-2xl mb-6 border border-white/10"
      role="region" aria-label="Filters"
    >
      <div className="flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faSlidersH} className="w-5 h-5 text-primary" aria-hidden="true" />
        <h2 className="text-white font-bold text-lg">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <fieldset className="flex flex-col gap-2 border-0 p-0">
          <legend className="text-slate-400 text-sm font-medium mb-1">Show Status</legend>
          {STATUS_FILTERS.map(({ id, key, label, accent }) => (
            <label key={id} htmlFor={id} className="flex items-center gap-2 cursor-pointer text-white text-sm">
              <input
                id={id}
                type="checkbox"
                checked={filters[key]}
                onChange={(e) => onChange(key, e.target.checked)}
                className={`w-4 h-4 ${accent}`}
              />
              {label}
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-2 ">
          <label htmlFor="f-difficulty" className="text-slate-400 text-sm font-medium">Difficulty</label>
          <select
            id="f-difficulty"
            value={filters.difficulty}
            onChange={(e) => onChange('difficulty', e.target.value)}
            className="bg-dark-900 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm"
          >
            <option className='bg-gray-900' value="all">All Levels</option>
            <option className='bg-gray-900' value="Easy">Easy</option>
            <option className='bg-gray-900' value="Medium">Medium</option>
            <option className='bg-gray-900' value="Hard">Hard</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="f-sort" className="text-slate-400 text-sm font-medium">Sort By</label>
          <select
            id="f-sort"
            value={filters.sortBy}
            onChange={(e) => onChange('sortBy', e.target.value)}
            className="bg-dark-900 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500  text-sm"
          >
            <option className='bg-gray-900' value="status">Best Match</option>
            <option className='bg-gray-900' value="income">Income Required</option>
            <option className='bg-gray-900' value="costOfLiving">Cost of Living</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
