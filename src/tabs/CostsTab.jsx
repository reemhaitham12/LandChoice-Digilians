export default function CostsTab({ country }) {
  const rows = [
    { label: 'Application Fee', value: country.costUSD ? `$${country.costUSD}` : null },
    ...(country.costs ? Object.entries(country.costs).map(([label, value]) => ({ label, value })) : []),
  ].filter(r => r.value != null);

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Costs</h2>

      {rows.length ? (
        <table className="w-full text-sm">
          <tbody className="divide-y divide-white/5">
            {rows.map(({ label, value }, i) => (
              <tr key={i}>
                <td className="py-3 text-slate-400">{label}</td>
                <td className="py-3 text-right font-medium">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-slate-400 text-sm">No cost information available.</p>
      )}
    </div>
  );
}
