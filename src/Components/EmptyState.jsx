import { FiMessageCircle } from "react-icons/fi";

const EmptyState = ({ onCreateClick }) => {
  return (
    <div className="bg-[#081226] border border-white/[0.08] rounded-[28px] p-10 sm:p-14 text-center shadow-[0_0_40px_rgba(59,130,246,0.04)]">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-[#0B1730] flex items-center justify-center border border-white/10">
        <FiMessageCircle className="text-[#3B82F6] text-2xl" />
      </div>
      <h3 className="text-white text-xl font-semibold mb-2">No Posts Yet</h3>
      <p className="text-[#94A3B8] text-sm mb-6 max-w-sm mx-auto">
        Share your first travel, visa, study, work, or relocation experience.
      </p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white text-sm font-medium hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      >
        <FiMessageCircle size={16} />
        <span>Create First Post</span>
      </button>
    </div>
  );
};

export default EmptyState;