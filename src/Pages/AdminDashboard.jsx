import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

import AdminSidebar from "../Components/admin/AdminSidebar";
import UsersTab from "../Components/admin/UsersTab";
import AdminsTab from "../Components/admin/AdminsTab";
import CountriesTab from "../Components/admin/CountriesTab";
import AdsTab from "../Components/admin/AdsTab";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  // ─── Role Check ───
  if (user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6 pt-[73px]">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "admins" && <AdminsTab />}
        {activeTab === "countries" && <CountriesTab />}
        {activeTab === "ads" && <AdsTab />}
      </main>
    </div>
  );
}