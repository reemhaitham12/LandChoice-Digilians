export default function OverviewTab({ country }) {
  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <p className="text-slate-300 leading-relaxed">{country.longDescription}</p>
    </div>
  );
}
