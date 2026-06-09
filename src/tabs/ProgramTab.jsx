import { useParams } from "react-router-dom";
import { useVisa } from "../context/visaContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPassport } from '@fortawesome/free-solid-svg-icons';

export default function ProgramTab() {
  const { id } = useParams();
  const { visaData } = useVisa();


  const countries = Array.isArray(visaData) ? visaData : Array.isArray(visaData?.countries) ? visaData.countries : [];
  const country = countries.find(c => 
    String(c.country_id) === String(id) || 
    String(c._id) === String(id) || 
    String(c.id) === String(id) || 
    c.country?.toLowerCase() === String(id).toLowerCase()
  ) ?? null;


  if (!country) return null;


  const programDetails = {
    "Visa Name": country.visaName,
    "Visa Type": country.visaType,
    "Duration": `${country.durationMonths} Months`,
    "Renewable": country.renewableYears > 0 ? `Yes (Up to ${country.renewableYears} years)` : "No",
    "Difficulty": country.difficulty,
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 bg-white/5">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faPassport} className="text-blue-400" />
        Program Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(programDetails).map(([key, val]) => (
          <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {key}
            </div>
            <div className="text-base font-semibold text-white">
              {val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}