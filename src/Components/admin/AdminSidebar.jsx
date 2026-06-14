export default function AdminSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "users", label: "Users" },
    { key: "admins", label: "Admins" },
    { key: "countries", label: "Countries" },
    { key: "ads", label: "Ads" },
  ];

  const linkClass = (tab) =>
    `px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap text-sm font-medium
     flex items-center justify-center md:justify-start
     ${
       activeTab === tab
         ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <aside
  className="
    bg-gray-900 border-gray-800

    /* Mobile */
    flex flex-row overflow-x-auto gap-2 p-3 border-b rounded-2xl

    /* Desktop */
    md:flex-col
    md:w-64
    md:p-5
    md:ml-4
    md:mt-4
    md:h-[calc(100vh-2rem)]
    md:rounded-2xl
    md:border
    md:overflow-visible
  "
>
      {/* Tabs */}
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={linkClass(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </aside>
  );
}