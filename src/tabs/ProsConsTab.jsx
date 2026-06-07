import { useParams } from "react-router-dom";
import { useVisa } from "../context/visaContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faBalanceScale } from '@fortawesome/free-solid-svg-icons';

export default function ProsConsTab() {
  const { id } = useParams();
  const { visaData } = useVisa();

  const countries = Array.isArray(visaData) ? visaData : Array.isArray(visaData?.countries) ? visaData.countries : [];
  const country = countries.find(c => String(c.country_id) === String(id) || String(c._id) === String(id) || String(c.id) === String(id) || c.country?.toLowerCase() === String(id).toLowerCase()) ?? null;

  if (!country) return null;

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 bg-white/5">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faBalanceScale} className="text-blue-400" />
        Pros & Cons
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
          <h3 className="text-sm font-extrabold text-green-400 uppercase tracking-widest mb-4">Pros</h3>
          {country.benefits?.length ? (
            <ul className="space-y-3">
              {country.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="bg-green-500/20 text-green-400 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">None listed.</p>
          )}
        </div>

        {/* Cons */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
          <h3 className="text-sm font-extrabold text-red-400 uppercase tracking-widest mb-4">Cons</h3>
          {country.restrictions?.length ? (
            <ul className="space-y-3">
              {country.restrictions.map((r, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="bg-red-500/20 text-red-400 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                    <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                  </div>
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