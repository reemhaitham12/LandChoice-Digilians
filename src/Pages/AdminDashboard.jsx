import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminSidebar from "../Components/admin/AdminSidebar";
import UsersTab from "../Components/admin/UsersTab";
import AdminsTab from "../Components/admin/AdminsTab";
import CountriesTab from "../Components/admin/CountriesTab";
import AdsTab from "../Components/admin/AdsTab";

import {
  getAllAds,
  deleteAd,
  toggleAdStatus,
  updateAd,
  createAd,
} from "../Services/ads/adsService";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("users");

  // Ads states
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);

  // Edit modal states
  const [editingAd, setEditingAd] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    companyName: "",
    linkUrl: "",
    startDate: "",
    endDate: "",
    position: 0,
  });
  // ───────── AUTH CHECK ─────────
  if (user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  // ───────── FETCH ADS ─────────
  const fetchAds = async () => {
    try {
      setLoadingAds(true);
      const data = await getAllAds();
      setAds(data || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoadingAds(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ads") {
      fetchAds();
    }
  }, [activeTab]);

 


  
  // ───────── DELETE ─────────
  const handleDelete = async (id) => {
    try {
      await deleteAd(id);
      setAds((prev) => prev.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // ───────── TOGGLE (Optimistic UI) ─────────
  const handleToggle = async (id) => {
    try {
      setAds((prev) =>
        prev.map((ad) =>
          ad._id === id ? { ...ad, isActive: !ad.isActive } : ad
        )
      );

      await toggleAdStatus(id);
    } catch (error) {
      console.error(error);
      fetchAds(); // fallback
    }
  };

  // ───────── OPEN EDIT ─────────
  const handleEdit = (ad) => {
    setEditingAd(ad);
    setShowModal(true);
  };

  // ───────── SAVE UPDATE ─────────
  const handleUpdate = async () => {
    try {
      await updateAd(editingAd._id, editingAd);

      setShowModal(false);
      setEditingAd(null);

      fetchAds();
    } catch (error) {
      console.error(error);
    }
  };

  // ───────── ADD (future modal) ─────────
  const handleAdd = () => {
    setShowAddModal(true);
  };
 const handleCreateAd = async () => {
  try {
    console.log("Sending Ad:", newAd);

    await createAd({
      ...newAd,
      startDate: new Date(newAd.startDate).toISOString(),
      endDate: new Date(newAd.endDate).toISOString(),
    });

    fetchAds();
    setShowAddModal(false);
  } catch (error) {
    console.log(error.response?.data);
    console.error(error);
  }
};

  return (
    <div className="min-h-screen py-5 bg-dark-900 text-white flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 pt-[73px]">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "admins" && <AdminsTab />}
        {activeTab === "countries" && <CountriesTab />}

        {activeTab === "ads" && (
          <>
            {loadingAds ? (
              <p>Loading ads...</p>
            ) : (
              <AdsTab
                ads={ads}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            )}
          </>
        )}
      </main>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-[500px]">

            <h2 className="text-xl font-bold mb-4">
              Add New Advertisement
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={newAd.title}
              onChange={(e) =>
                setNewAd({ ...newAd, title: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800"
            />

            <textarea
              placeholder="Description"
              value={newAd.description}
              onChange={(e) =>
                setNewAd({ ...newAd, description: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800"
            />

            <input
              type="text"
              placeholder="Company Name"
              value={newAd.companyName}
              onChange={(e) =>
                setNewAd({ ...newAd, companyName: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800"
            />

            <input
              type="url"
              placeholder="Link URL"
              value={newAd.linkUrl}
              onChange={(e) =>
                setNewAd({ ...newAd, linkUrl: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800"
            />

            <input
              type="date"
              value={newAd.startDate}
              onChange={(e) =>
                setNewAd({ ...newAd, startDate: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800"
            />

            <input
              type="date"
              value={newAd.endDate}
              onChange={(e) =>
                setNewAd({ ...newAd, endDate: e.target.value })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800"
            />

            <input
              type="number"
              placeholder="Position"
              value={newAd.position}
              onChange={(e) =>
                setNewAd({
                  ...newAd,
                  position: Number(e.target.value),
                })
              }
              className="w-full mb-3 p-2 rounded bg-gray-800"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateAd}
                className="px-4 py-2 bg-blue-600 rounded"
              >
                Create Ad
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ───────── EDIT MODAL ───────── */}
      {showModal && editingAd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-[400px]">

            <h2 className="text-xl mb-4">Edit Ad</h2>

            <input
              className="w-full mb-2 p-2 bg-gray-800 rounded"
              value={editingAd.title || ""}
              onChange={(e) =>
                setEditingAd({ ...editingAd, title: e.target.value })
              }
              placeholder="Title"
            />

            <input
              className="w-full mb-2 p-2 bg-gray-800 rounded"
              value={editingAd.companyName || ""}
              onChange={(e) =>
                setEditingAd({ ...editingAd, companyName: e.target.value })
              }
              placeholder="Company Name"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-green-600 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}