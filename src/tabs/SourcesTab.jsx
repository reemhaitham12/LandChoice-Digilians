import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

export default function SourcesTab({ country }) {
  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Sources</h2>

      {country.sources?.length ? (
        <ul className="space-y-2">
          {country.sources.map((s, i) => (
            <li key={i}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs shrink-0" />
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm">No sources available.</p>
      )}
    </div>
  );
}
