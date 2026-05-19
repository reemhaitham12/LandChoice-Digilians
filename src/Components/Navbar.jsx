import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#111827]/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">
              LandChoice
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {user.fullName?.charAt(0)?.toUpperCase() ||
                        user.email?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                  <span className="text-gray-300 text-sm hidden sm:block">
                    {user.fullName || user.email || "User"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300 border border-red-500/20 text-sm font-medium"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;