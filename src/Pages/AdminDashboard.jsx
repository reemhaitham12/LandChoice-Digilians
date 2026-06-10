// import { useAuth } from "../context/AuthContext";
// import { Navigate } from "react-router-dom";
// import { useState } from "react";

// import AdminSidebar from "../Components/admin/AdminSidebar";
// import UsersTab from "../Components/admin/UsersTab";
// import AdminsTab from "../Components/admin/AdminsTab";
// import CountriesTab from "../Components/admin/CountriesTab";
// import AdsTab from "../Components/admin/AdsTab";

// export default function AdminDashboard() {
//   const { user } = useAuth();
//   const [activeTab, setActiveTab] = useState("users");

//   // ─── Role Check ───
//   if (user?.role !== "Admin") {
//     return <Navigate to="/" replace />;
//   }

//   return (
//     <div className="min-h-screen bg-dark-900 text-white flex">
//       <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//       <main className="flex-1 p-6 pt-[73px]">
//         {activeTab === "users" && <UsersTab />}
//         {activeTab === "admins" && <AdminsTab />}
//         {activeTab === "countries" && <CountriesTab />}
//         {activeTab === "ads" && <AdsTab />}
//       </main>
//     </div>
//   );
// }

import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AdminSidebar from "../Components/admin/AdminSidebar";
import UsersTab from "../Components/admin/UsersTab";
import AdminsTab from "../Components/admin/AdminsTab";
import CountriesTab from "../Components/admin/CountriesTab";
import AdsTab from "../Components/admin/AdsTab";

import {
getAllAds,
deleteAd,
toggleAdStatus,
} from "../services/ads/adsService";

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

  console.log("Ads Data:", data);

  setAds(data || []);
} catch (error) {
  console.error("Error fetching ads:", error);
} finally {
  setLoadingAds(false);
}

};

useEffect(() => {
fetchAds();
}, []);

const handleDelete = async (id) => {
try {
await deleteAd(id);

  setAds((prev) => prev.filter((ad) => ad._id !== id));
} catch (error) {
  console.error(error);
}

};

const handleToggle = async (id) => {
try {
await toggleAdStatus(id);

  const updatedAds = await getAllAds();
  setAds(updatedAds);
} catch (error) {
  console.error(error);
}

};

const handleAdd = () => {
console.log("Open Add Ad Modal");
};

const handleEdit = (ad) => {
console.log("Edit Ad:", ad);
};

return ( <div className="min-h-screen bg-dark-900 text-white flex"> <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

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
</div>

);
}
