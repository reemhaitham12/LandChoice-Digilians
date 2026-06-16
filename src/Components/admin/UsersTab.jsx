import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Pencil,
  ArrowRightLeft,
  Trash2,
  UserPlus,
} from "lucide-react";

import {
  getAllUsers,
  promoteUserToAdmin,
  deleteUser,
} from "../../Services/admin/adminService";
export default function UsersTab() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    loadUsers();
  }, []);
  const showToast = (message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers();

      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePromote = async (email) => {
    try {
      await promoteUserToAdmin(email);

      setUsers((prev) => prev.filter((user) => user.email !== email));

      showToast("User promoted to admin successfully", "success");
    } catch (error) {
      showToast(error?.response?.data?.error || "Error", "error");
    }
  };
  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Delete ${user.name}?`);

    if (!confirmed) return;

    try {
      await deleteUser(user.email);

      setUsers((prev) => prev.filter((u) => u.email !== user.email));

      showToast("User deleted successfully 🗑️", "success");
    } catch (error) {
      showToast(error?.response?.data?.error || "Error", "error");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Users Directory
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage registered accounts, perform searches, updates and adjust roles.
          </p>
        </div>
        {/* <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-500 hover:to-blue-400 transition-all duration-200 active:scale-95">
          <Plus className="w-4 h-4" />
          Add users
        </button> */}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>


      {/* Users Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <UserPlus className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">No users found</p>
          <p className="text-slate-600 text-sm mt-1">
            Try adjusting your search or add a new user.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((user, index) => (
            <div
              key={user._id || user.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 transition-all duration-300 hover:bg-white/8 hover:border-white/15 hover:shadow-2xl hover:shadow-blue-500/10"
              style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-300">
                      {user.name?.split(" ").map((n) => n[0]).join("") || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.is_verified
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                >
                  {user.is_verified ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="h-px bg-white/10 my-4" />

              <div className="flex items-center gap-2 flex-wrap">

                <button
                  onClick={() => handlePromote(user.email)}
                  className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 active:scale-95"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  Switch to Admin
                </button>

                <button
                  onClick={() => handleDelete(user)}
                  className="inline-flex items-center justify-center gap-2 px-10 py-1.5 rounded-xl text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[250px] px-4 py-3 rounded-xl text-sm shadow-lg border backdrop-blur-xl
        transition-all duration-300 animate-fade-in
        ${toast.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
              }
      `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>

  );
}