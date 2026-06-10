import { useState, useEffect } from "react";
import { Search, Plus, Pencil, ArrowRightLeft, Trash2, Shield, UserPlus, X, Loader2 } from "lucide-react";

import {
  getAllAdmins,
  getRegularUsers,
  promoteUserToAdmin,
  demoteAdminToUser,
  deleteUser,
} from "../../Services/admin/adminService";

// ─── Toast Component ───
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg bg-emerald-500/15 border-emerald-500/30 text-emerald-300 min-w-[300px] animate-slide-in">
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Confirm Dialog ───
function ConfirmDialog({ confirm, onClose, onConfirm }) {
  if (!confirm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Confirm Action</h3>
        <p className="text-slate-400 mb-6">
          Are you sure you want to {confirm.action} <strong className="text-white">{confirm.item.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───
function EditModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Edit Admin</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 focus:outline-none transition-all"
              value={formData.email}
              disabled
            />
          </div>
          <button
            onClick={() => onSave({ ...user, name: formData.name })}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-500 hover:to-blue-400 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTabs() {
  const [activeView, setActiveView] = useState("admins"); // "admins" or "users"
  const [admins, setAdmins] = useState([]);
  const [regularUsers, setRegularUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // UI States
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, user: null });

  // ─── Toast Helpers ───
  const addToast = (message) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ─── Fetch Data ───
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [adminsRes, usersRes] = await Promise.all([
        getAllAdmins(),
        getRegularUsers(),
      ]);

      setAdmins(adminsRes.admins || []);
      setRegularUsers(usersRes.users || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.error || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─── Actions ───
  const handlePromote = async (email) => {
    try {
      await promoteUserToAdmin(email);
      addToast("User promoted to admin successfully!");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to promote user");
    }
  };

  const handleDemote = async (email) => {
    try {
      await demoteAdminToUser(email);
      addToast("Admin demoted to user successfully!");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to demote admin");
    }
  };

  const handleDelete = async (email) => {
    try {
      await deleteUser(email);
      addToast("Deleted successfully!");
      fetchData();
      setConfirm(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete");
    }
  };

  const handleEdit = async (updatedUser) => {
    // Note: Backend doesn't have an edit user endpoint in the docs
    // This would need to be implemented or you can just close the modal
    addToast("User updated (frontend only - implement API call)");
    setEditModal({ open: false, user: null });
  };

  // ─── Filter ───
  const filteredAdmins = admins.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = regularUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Administrator Group
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Oversee members with administrative clearance. Manage roles and permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("admins")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeView === "admins"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
              }`}
          >
            <Shield className="w-4 h-4" />
            Admins ({admins.length})
          </button>
          {/* <button
            onClick={() => setActiveView("users")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeView === "users"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Users ({regularUsers.length})
          </button> */}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
          <p className="font-medium">{error}</p>
          <button onClick={() => setError(null)} className="mt-2 text-sm underline hover:text-red-200">
            Dismiss
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-slate-400">Loading...</span>
        </div>
      )}

      {/* Search */}
      {!loading && (
        <div className="mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              placeholder={

                "Search admins by name or email..."

              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Admins View */}
      {!loading && activeView === "admins" && (
        <>
          {filteredAdmins.length === 0 ? (
            <div className="text-center py-16">
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No admins found</p>
              <p className="text-slate-600 text-sm mt-1">
                Switch to Users tab to promote someone to admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAdmins.map((admin, index) => (
                <div
                  key={admin._id || admin.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-5 transition-all duration-300 hover:bg-white/8 hover:border-white/15 hover:shadow-2xl hover:shadow-blue-500/10"
                  style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-500/20 border border-blue-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{admin.name}</h3>
                        <p className="text-sm text-slate-400">{admin.email}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-blue-600/20 text-blue-400 border-blue-500/30">
                      ADMIN
                    </span>
                  </div>

                  <div className="h-px bg-white/10 my-4" />

                  <div className="flex items-center gap-2 flex-wrap">

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDemote(admin.email)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 active:scale-95"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Demote to User
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}



      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} onClose={() => removeToast(toast.id)} />
        ))}
      </div>


    </div>
  );
}