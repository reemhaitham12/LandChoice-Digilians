import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, faFileAlt, faCheckCircle, 
  faDollarSign, faChartBar, faExternalLinkAlt 
} from '@fortawesome/free-solid-svg-icons';

const TABS = [
  { id: 'overview', label: 'Overview', icon: faInfoCircle },
  { id: 'program', label: 'Program', icon: faFileAlt },
  { id: 'requirements', label: 'Requirements', icon: faCheckCircle },
  { id: 'costs', label: 'Costs & Living', icon: faDollarSign },
  { id: 'procon', label: 'Pros & Cons', icon: faChartBar },
  { id: 'sources', label: 'Sources', icon: faExternalLinkAlt },
];

export default function CountryTabs({ activeTab, setActiveTab }) {
  return (
    <div className="max-w-5xl mx-auto px-6 mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
              activeTab === id
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FontAwesomeIcon icon={icon} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}