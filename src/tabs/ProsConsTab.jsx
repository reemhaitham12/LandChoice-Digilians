export default function ProsConsTab({ country }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-4">Pros &amp; Cons</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-3">Pros</h3>
          {country.benefits?.length ? (
            <ul className="space-y-2">
              {country.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-green-500 mt-0.5 shrink-0">+</span>
                  {b}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">None listed.</p>
          )}
        </div>

        <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3">Cons</h3>
          {country.restrictions?.length ? (
            <ul className="space-y-2">
              {country.restrictions.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-red-500 mt-0.5 shrink-0">−</span>
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">None listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
