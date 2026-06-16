import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faBolt, faClock, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import DifficultyBadge from '../ui/DifficultyBadge';
import { useAuth } from '../../context/AuthContext';

export default function CountryHero({ country, navigate: navProp }) {
  const navigate = navProp || useNavigate();
  const { user } = useAuth();

  const handleCompare = () => {
    navigate(`/compare?add=${encodeURIComponent(country.country_id || country._id || country.id)}`);
  };

  const handleEligibility = () => {
    navigate('/salary-fit');
  };

  const handleTrack = () => {
    navigate(`/checklist?country=${encodeURIComponent(country.country_id || country._id || country.id)}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 mb-8">
      <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
        {/* Color top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
          style={{ backgroundColor: country.color }}
        />

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Country info */}
          <div className="flex gap-5 items-start">
            <img
              src={`https://flagcdn.com/w80/${country.countryCode?.toLowerCase() || 'un'}.png`}
              alt={`${country.country} flag`}
              className="h-16 w-auto rounded-lg border border-white/10 shadow-lg"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {country.country}
              </h1>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <DifficultyBadge level={country.difficulty} />
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: `${country.color}22`,
                    color: country.color,
                    border: `1px solid ${country.color}44`,
                  }}
                >
                  <FontAwesomeIcon icon={faFileAlt} className="text-[10px]" />
                  {country.visaName}
                </span>
              </div>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                {country.description || `Discover the ${country.visaName} for ${country.country}`}
              </p>
            </div>
          </div>

          {/* Action buttons — all linked */}
          <div className="flex flex-col gap-3 min-w-[180px]">
            <button
              onClick={handleCompare}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary/20 text-primary border border-primary/30 hover:bg-primary/40 transition-all text-sm font-semibold"
            >
              <FontAwesomeIcon icon={faPlus} /> Add to Compare
            </button>

            <button
              onClick={handleEligibility}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold"
            >
              <FontAwesomeIcon icon={faBolt} /> Check Eligibility
            </button>

            <button
              onClick={handleTrack}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white transition-all text-sm font-semibold"
            >
              <FontAwesomeIcon icon={faClock} /> Track Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
