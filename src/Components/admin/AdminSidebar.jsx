export default function AdminSidebar({ activeTab, setActiveTab }) {
  const linkClass = (tab) =>
    `w-full text-left px-4 py-3 rounded-lg transition-all duration-200
     ${
       activeTab === tab
         ? "bg-blue-600 text-white"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <aside className="w-64 min-h-screen  border-r border-gray-800 p-4 flex flex-col gap-2">
      
      <h2 className="text-white text-xl font-bold mb-6">
        Admin Panel
      </h2>

      <button onClick={() => setActiveTab("users")} className={linkClass("users")}>
        Users
      </button>

      <button onClick={() => setActiveTab("admins")} className={linkClass("admins")}>
        Admins
      </button>

      <button onClick={() => setActiveTab("countries")} className={linkClass("countries")}>
        Countries
      </button>

      <button onClick={() => setActiveTab("ads")} className={linkClass("ads")}>
        Ads
      </button>
    </aside>
  );
}