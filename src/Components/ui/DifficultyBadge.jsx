const DIFFICULTY_STYLES = {
  Easy:   'bg-green-500/10  text-green-400  border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Hard:   'bg-red-500/10   text-red-400    border-red-500/20',
};

export default function DifficultyBadge({ level }) {
  const styles = DIFFICULTY_STYLES[level] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/20';

  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${styles}`}>
      {level}
    </span>
  );
}
