import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faBolt, faClock } from '@fortawesome/free-solid-svg-icons';
import DifficultyBadge from '../ui/DifficultyBadge';


export default function CountryHero({ country, navigate }) {
  return (
    <div className="glass-card p-8 mb-8 rounded-3xl">
      <button onClick={() => navigate(-1)} className="mb-6 text-slate-400 hover:text-white transition-colors">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back
      </button>

      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-5 items-start">
          <img
            src={`https://flagcdn.com/w80/${country.countryCode.toLowerCase()}.png`}
            alt={`${country.country} flag`}
            className="h-16 rounded border border-white/10"
          />
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{country.country}</h1>
            <DifficultyBadge level={country.difficulty} />
            <p className="text-slate-400 mt-2 max-w-md text-sm leading-relaxed">
              {country.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button className="btn-primary flex items-center gap-2">
            <FontAwesomeIcon icon={faPlus} /> Compare
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <FontAwesomeIcon icon={faBolt} /> Check Eligibility
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} /> Track
          </button>
        </div>
      </div>
    </div>
  );
}
