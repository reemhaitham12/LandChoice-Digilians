

import { useParams } from "react-router-dom";
import { useVisa } from "../context/visaContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

export default function CostsTab() {
  const { id } = useParams();
  const { visaData } = useVisa();

  const countries = Array.isArray(visaData) ? visaData : Array.isArray(visaData?.countries) ? visaData.countries : [];
  const country = countries.find(c => String(c.country_id) === String(id) || String(c._id) === String(id) || String(c.id) === String(id) || c.country?.toLowerCase() === String(id).toLowerCase()) ?? null;

  if (!country) return null;

  const rows = [
    { label: 'Application Fee', value: country.costUSD ? `$${country.costUSD}` : null },
    { label: 'Minimum Monthly Income', value: country.minIncomeMonthly ? `${country.currencySymbol}${country.minIncomeMonthly.toLocaleString()}` : null },
    { label: 'Minimum Yearly Income', value: country.minIncomeYearly ? `${country.currencySymbol}${country.minIncomeYearly.toLocaleString()}` : null },
  ].filter(r => r.value != null);

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 bg-white/5">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faWallet} className="text-green-400" />
        Costs & Financials
      </h2>

      {rows.length ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/10">
              {rows.map(({ label, value }, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-slate-300 font-medium">{label}</td>
                  <td className="py-4 px-6 text-right font-bold text-white">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-400 text-sm">No cost information available.</p>
      )}
    </div>
  );
}
