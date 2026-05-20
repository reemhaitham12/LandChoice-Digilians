export default function ProgramTab({ country }) {
  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Program</h2>
      <p className="text-slate-300 mb-6">{country.visaName}</p>

      {country.programDetails && (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(country.programDetails).map(([key, val]) => (
            <div key={key} className="bg-dark-800 rounded-xl p-4">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">{key}</div>
              <div className="text-sm font-medium">{val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
