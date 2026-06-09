const DIFFICULTY_STYLES = {
  Easy:   'bg-green-500/15 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Hard:   'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function DifficultyBadge({ level }) {
  const styles = DIFFICULTY_STYLES[level] ?? 'bg-gray-500/15 text-gray-400 border-gray-500/30';

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
      {level}
    </span>
  );
}