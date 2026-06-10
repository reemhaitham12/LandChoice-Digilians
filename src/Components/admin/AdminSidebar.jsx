export default function AdminSidebar({ activeTab, setActiveTab }) {
  const linkClass = (tab) =>
    `px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap
     ${
       activeTab === tab
         ? "bg-blue-600 text-white"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <aside
      className="
        w-full md:w-64
        flex md:flex-col flex-row
        gap-2
        p-2 md:p-4
        border-b md:border-b-0 md:border-r border-gray-800
        overflow-x-auto
        bg-gray-900
      "
    >
      <h2 className="text-white text-lg font-bold mr-4 md:mb-6 md:mr-0">
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