export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 min-h-screen border-r border-gray-700 p-4">
      <button onClick={() => setActiveTab("users")}>
        Users
      </button>

      <button onClick={() => setActiveTab("admins")}>
        Admins
      </button>

      <button onClick={() => setActiveTab("countries")}>
        Countries
      </button>

      <button onClick={() => setActiveTab("ads")}>
        Ads
      </button>
    </aside>
  );
}