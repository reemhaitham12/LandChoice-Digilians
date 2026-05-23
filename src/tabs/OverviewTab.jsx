import { useParams } from "react-router-dom";
import { useVisa } from "../context/visaContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faBolt, faUsers } from '@fortawesome/free-solid-svg-icons';

export default function OverviewTab() {
  const { id } = useParams();
  const { visaData } = useVisa();

  // Find the country from context
  const countries = Array.isArray(visaData) ? visaData : Array.isArray(visaData?.countries) ? visaData.countries : [];
  const country = countries.find(c => 
    String(c.country_id) === String(id) || 
    String(c._id) === String(id) || 
    String(c.id) === String(id) ||
    c.country?.toLowerCase() === String(id).toLowerCase()
  ) ?? null;

  if (!country) return null;

  return (
    <div className="space-y-6">
      {/* About Section */}
      <div className="glass-card rounded-3xl p-8 border border-white/10 bg-white/5">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faGlobe} className="text-blue-400" />
          About this Program
        </h2>
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          {country.description || 
           `${country.country}'s ${country.visaName} comes with great incentives for incoming nomads. 
           With a required minimum income of ${country.currencySymbol}${country.minIncomeMonthly?.toLocaleString()} per month, 
           you can enjoy living in ${country.country} for up to ${country.durationMonths} months. 
           ${country.renewableYears > 0 ? `The visa is renewable for up to ${country.renewableYears} years.` : ''}`
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Facts Section */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 bg-white/5">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faBolt} className="text-yellow-400" />
            Quick Facts
          </h3>
          <div className="space-y-4">
            <FactRow label="Visa Type" value={country.visaType} />
            <FactRow label="Processing Time" value={`${country.processingWeeks} weeks`} />
            <FactRow 
              label="Renewable" 
              value={country.renewableYears > 0 ? `Up to ${country.renewableYears} years` : 'No'} 
            />
            <FactRow label="Timezone" value={country.timezone} />
            <FactRow label="Internet Speed" value={`${country.internetSpeed} Mbps avg`} />
            <FactRow label="English Proficiency" value={country.englishProficiency} />
            <FactRow label="Application Fee" value={`$${country.costUSD}`} />
          </div>
        </div>

        {/* Best For & Stats Section */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 border border-white/10 bg-white/5 h-full">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="text-blue-400" />
              Best For
            </h3>
            
            {/* Dynamic Best For Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {country.bestFor?.length > 0 ? (
                country.bestFor.map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold border"
                    style={{
                      backgroundColor: `${country.color}15`,
                      borderColor: `${country.color}40`,
                      color: country.color
                    }}
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 text-sm">No specific demographic listed.</span>
              )}
            </div>

            {/* Progress Bar Stats */}
            <div className="space-y-5">
              <ProgressBar 
                label="Internet Speed" 
                value={country.internetSpeed} 
                max={200} 
                suffix=" Mbps" 
                color={country.color} 
              />
              <ProgressBar 
                label="Safety Rating" 
                value={country.safetyRating} 
                max={10} 
                suffix=" / 10" 
                color="#10b981" 
              />
              <ProgressBar 
                label="Quality of Life" 
                value={country.qualityOfLife} 
                max={10} 
                suffix=" / 10" 
                color="#facc15" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper Components ── */
function FactRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white font-bold text-sm text-right">{value || 'N/A'}</span>
    </div>
  );
}

function ProgressBar({ label, value, max, suffix, color }) {
  const percentage = Math.min(100, Math.max(0, ((value || 0) / max) * 100));
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-bold">{value}{suffix}</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}