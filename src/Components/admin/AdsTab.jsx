import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { createAd, updateAd, deleteAd, toggleAdStatus, getAllAds } from "../../Services/ads/adsService";

export default function AdsTab() {
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);
  const [editAd, setEditAd] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const fetchAds = async () => {
    try {
      setLoadingAds(true);
      const data = await getAllAds();
      setAds(data || []);
    } catch (err) {
      addToast("Failed to load ads", "error");
    } finally {
      setLoadingAds(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const emptyForm = {
    title: "", description: "", companyName: "",
    linkUrl: "", startDate: "", endDate: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [addForm, setAddForm] = useState(emptyForm);

  const resetForms = () => { setForm(emptyForm); setAddForm(emptyForm); };
  const closeModal = () => { setEditAd(null); setAddOpen(false); resetForms(); };

  const handleEditClick = (ad) => {
    setForm({
      title: ad.title || "",
      description: ad.description || "",
      companyName: ad.companyName || "",
      linkUrl: ad.linkUrl || "",
      startDate: ad.startDate?.slice(0, 10) || "",
      endDate: ad.endDate?.slice(0, 10) || "",
    });
    setEditAd(ad._id);
  };

  const validateForm = (data) => {
    if (!data.title.trim()) { addToast("Title is required", "error"); return false; }
    if (!data.startDate || !data.endDate) { addToast("Start and end date required", "error"); return false; }
    if (new Date(data.startDate) >= new Date(data.endDate)) { addToast("Start date must be before end date", "error"); return false; }
    return true;
  };

  const parseError = (err) => {
    const data = err.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") return data.message || data.error || "Something went wrong";
    return err.message || "Something went wrong";
  };

  //  Optimistic delete
  const handleDelete = async (id) => {
    setAds((prev) => prev.filter((ad) => ad._id !== id));
    try {
      await deleteAd(id);
      addToast("Ad deleted successfully ", "success");
    } catch (err) {
      addToast(parseError(err), "error");
      fetchAds(); // rollback
    }
  };

  //  Optimistic toggle
  const handleToggle = async (id) => {
    setAds((prev) =>
      prev.map((ad) => ad._id === id ? { ...ad, isActive: !ad.isActive } : ad)
    );
    try {
      await toggleAdStatus(id);
      addToast("Ad status updated ", "success");
    } catch (err) {
      addToast(parseError(err), "error");
      fetchAds(); // rollback
    }
  };

  const handleCreate = async () => {
    if (!validateForm(addForm)) return;
    try {
      setLoading(true);
      await createAd({
        ...addForm,
        startDate: new Date(addForm.startDate).toISOString(),
        endDate: new Date(addForm.endDate).toISOString(),
      });
      addToast("Ad created successfully ", "success");
      closeModal();
      fetchAds();
    } catch (err) {
      addToast(parseError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!validateForm(form)) return;
    try {
      setLoading(true);
      await updateAd(editAd, {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      });
      addToast("Ad updated successfully ", "success");
      closeModal();
      fetchAds();
    } catch (err) {
      addToast(parseError(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition";

  const renderFields = (data, setData) => (
    <div className="space-y-3">
      <input placeholder="Title" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className={inputClass} />
      <textarea placeholder="Description" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} className={inputClass} rows={3} />
      <input placeholder="Company Name" value={data.companyName} onChange={(e) => setData({ ...data, companyName: e.target.value })} className={inputClass} />
      <input placeholder="Link URL" value={data.linkUrl} onChange={(e) => setData({ ...data, linkUrl: e.target.value })} className={inputClass} />
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
          <input type="date" value={data.startDate} onChange={(e) => setData({ ...data, startDate: e.target.value })} className={inputClass} />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-400 mb-1 block">End Date</label>
          <input type="date" value={data.endDate} onChange={(e) => setData({ ...data, endDate: e.target.value })} className={inputClass} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Ads</h2>
        <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition">
          <Plus className="w-4 h-4" /> Add Ads
        </button>
      </div>
      {ads.length === 0 ? <p className="text-gray-400">No ads found</p> : ads.map((ad) => (
        <div
          key={ad._id}
          className="
    p-5 bg-white/5 border border-white/10 rounded-2xl mb-4
    flex flex-col gap-4
    md:flex-row md:justify-between md:items-center
  "
        >
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {ad.title}
            </h3>

            <p className="text-sm text-gray-400 leading-6">
              {ad.description || "No description available"}
            </p>
          </div>

          {/* Buttons */}
          <div
            className="
      flex flex-col gap-2
      sm:flex-row
      md:w-auto
    "
          >
            <button
              onClick={() => onToggle(ad._id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition
      ${ad.isActive
                  ? "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                  : "bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30"
                }`}
            >
              {ad.isActive ? "Active" : "Inactive"}
            </button>

            <button
              onClick={() => handleEditClick(ad)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 transition"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(ad._id)}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition"
            >
              Delete
            </button>
          </div>
        ))
      )}

      {/* Add Modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="w-[520px] max-w-[95%] rounded-2xl p-6 relative bg-gradient-to-b from-[#0b1220] to-[#0f1b33] border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.20)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-xl font-bold text-blue-300 mb-5">Add Advertisement</h2>
            {renderFields(addForm, setAddForm)}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20">Cancel</button>
              <button onClick={handleCreate} disabled={loading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium hover:opacity-90 transition disabled:opacity-50">
                {loading ? "Creating..." : "Create Ad"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editAd && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="w-[520px] max-w-[95%] rounded-2xl p-6 relative bg-gradient-to-b from-[#0b1220] to-[#0f1b33] border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.20)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-xl font-bold text-white mb-5">Edit Advertisement</h2>
            {renderFields(form, setForm)}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20">Cancel</button>
              <button onClick={handleSaveEdit} disabled={loading} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium hover:opacity-90 transition disabled:opacity-50">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className={`min-w-[280px] px-4 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-xl transition-all duration-300 ${toast.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}