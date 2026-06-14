import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AdminSidebar from "../Components/admin/AdminSidebar";
import UsersTab from "../Components/admin/UsersTab";
import AdminsTab from "../Components/admin/AdminsTab";
import CountriesTab from "../Components/admin/CountriesTab";
import AdsTab from "../Components/admin/AdsTab";

import { getAllAds, toggleAdStatus } from "../Services/ads/adsService";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("users");
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);

  if (user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

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
      fetchAds();
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col md:flex-row py-5">

      <div className="hidden md:block">
        <div className="pt-[60px] px-4">
          <div className="rounded-2xl shadow-lg">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-6 pt-20 md:pt-[73px]">

        <div className="md:hidden mb-4">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {activeTab === "users" && <UsersTab />}
        {activeTab === "admins" && <AdminsTab />}
        {activeTab === "countries" && <CountriesTab />}

        {activeTab === "ads" && (
          loadingAds ? (
            <p>Loading ads...</p>
          ) : (
            <AdsTab
              ads={ads}
              onToggle={handleToggle}
              onRefresh={fetchAds}
            />
          )
        )}

      </main>
    </div>
  );
}