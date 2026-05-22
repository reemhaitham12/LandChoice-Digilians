import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function RequirementsTab({ country }) {
  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Requirements</h2>

      {country.requirements?.length ? (
        <ul className="space-y-3">
          {country.requirements.map((req, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 mt-0.5 shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm">No requirements listed.</p>
      )}
    </div>
  );
}
