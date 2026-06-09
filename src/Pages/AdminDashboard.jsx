import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { getAllAdmins } from "../services/admin/adminService";

import AdminSidebar from "../Components/admin/AdminSidebar";
import UsersTab from "../Components/admin/UsersTab";
import AdminsTab from "../Components/admin/AdminsTab";
import CountriesTab from "../Components/admin/CountriesTab";
import AdsTab from "../Components/admin/AdsTab";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("users");
  const [admins, setAdmins] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoadingAdmins(true);

        const data = await getAllAdmins();

        console.log("Admins Response:", data);

        setAdmins(data || []);
      } catch (err) {
        console.error("Error fetching admins:", err);
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchAdmins();
  }, []);

  if (user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      <div className="flex pt-[73px]">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <main className="flex-1 p-6">
          {activeTab === "users" && <UsersTab />}

          {activeTab === "admins" && (
            <>
              <h2 className="mb-4 text-xl font-bold">
                Admins ({admins.length})
              </h2>

              {loadingAdmins ? (
                <p>Loading admins...</p>
              ) : (
                <AdminsTab
                  admins={admins}
                  openEditModal={() => { }}
                  switchToUser={() => { }}
                  handleDelete={() => { }}
                />
              )}
            </>
          )}

          {activeTab === "countries" && <CountriesTab />}
          {activeTab === "ads" && <AdsTab />}
        </main>
      </div>
    </div>
  );
}