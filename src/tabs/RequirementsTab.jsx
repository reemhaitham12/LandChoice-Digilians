
import { useParams } from "react-router-dom";
import { useVisa } from "../context/visaContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClipboardList } from '@fortawesome/free-solid-svg-icons';

export default function RequirementsTab() {
  const { id } = useParams();
  const { visaData } = useVisa();

  const countries = Array.isArray(visaData) ? visaData : Array.isArray(visaData?.countries) ? visaData.countries : [];
  const country = countries.find(c => String(c.country_id) === String(id) || String(c._id) === String(id) || String(c.id) === String(id) || c.country?.toLowerCase() === String(id).toLowerCase()) ?? null;

  if (!country) return null;

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 bg-white/5">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faClipboardList} className="text-blue-400" />
        Requirements
      </h2>

      {country.requirements?.length ? (
        <ul className="space-y-4">
          {country.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mt-1 shrink-0 text-lg" />
              <span className="leading-relaxed">{req}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400">No requirements listed.</p>
      )}
    </div>
  );
}
