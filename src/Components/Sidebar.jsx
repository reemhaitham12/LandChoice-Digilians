import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSignOutAlt, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <aside className="bg-[#081226] border border-white/[0.08] rounded-[28px] p-6 h-fit shadow-[0_0_40px_rgba(59,130,246,0.08)]">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          {user?.profileImage ? (
            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/10">
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#0B1730] flex items-center justify-center ring-2 ring-white/10">
              <FaUser className="text-[#3B82F6] text-3xl" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#081226]"></div>
        </div>
        <h2 className="text-white font-semibold text-lg">
          {displayName}
        </h2>
        <p className="text-[#64748B] text-sm mt-0.5">
          {user?.email || ""}
        </p>
        {user?.location && (
          <div className="flex items-center gap-1.5 text-[#94A3B8] text-sm mt-1">
            <FaMapMarkerAlt size={12} className="text-[#3B82F6]" />
            <span>{user.location}</span>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 mb-4"></div>

      <nav className="mb-4">
        <button
          className="w-full flex items-center gap-3 px-[18px] py-[14px] rounded-2xl text-sm font-medium bg-[#1E3A8A] text-[#60A5FA] border border-[rgba(96,165,250,0.15)] shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300"
        >
          <FiMessageCircle size={20} />
          <span>My Posts</span>
        </button>
      </nav>

      <div className="border-t border-white/10 mb-4"></div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-[14px] rounded-2xl bg-[rgba(127,29,29,0.25)] text-[#F87171] hover:bg-[rgba(127,29,29,0.4)] border border-[rgba(248,113,113,0.08)] transition-all duration-300 text-sm font-medium"
      >
        <FaSignOutAlt size={16} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

export default Sidebar;