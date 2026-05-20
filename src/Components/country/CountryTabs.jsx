const TABS = [
  { id: 'overview',     label: 'Overview'      },
  { id: 'program',      label: 'Program'       },
  { id: 'requirements', label: 'Requirements'  },
  { id: 'costs',        label: 'Costs'         },
  { id: 'procon',       label: 'Pros & Cons'   },
  { id: 'sources',      label: 'Sources'       },
];

export default function CountryTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto border-b border-white/10">
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === id
              ? 'border-primary text-white'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
