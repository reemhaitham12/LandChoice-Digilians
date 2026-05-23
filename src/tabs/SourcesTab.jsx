import { useParams } from "react-router-dom";
import { useVisa } from "../context/visaContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons';

export default function SourcesTab() {
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

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/10 bg-white/5">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <FontAwesomeIcon icon={faBookOpen} className="text-blue-400" />
        Official Sources & Links
      </h2>

   
      {country.sources?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {country.sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                  {source.name || "Official Link"}
                </h3>
                <p className="text-slate-400 text-xs">
                  {source.url ? new URL(source.url).hostname : 'Link available'}
                </p>
              </div>
              <FontAwesomeIcon 
                icon={faExternalLinkAlt} 
                className="text-slate-500 group-hover:text-blue-400 transition-colors" 
              />
            </a>
          ))}
        </div>
      ) : (
        
        <div className="text-center py-10 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-slate-400">
            Official application links and resources for {country.country} have not been added yet.
          </p>
        </div>
      )}
    </div>
  );
}