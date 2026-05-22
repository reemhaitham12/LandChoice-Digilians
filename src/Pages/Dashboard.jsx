import Navbar from "../Components/Navbar";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaChartLine, FaUsers, FaCog } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { title: "Total Properties", value: "24", icon: FaHome, color: "from-yellow-400 to-orange-500" },
    { title: "Active Listings", value: "18", icon: FaChartLine, color: "from-blue-400 to-blue-600" },
    { title: "Total Clients", value: "156", icon: FaUsers, color: "from-green-400 to-green-600" },
    { title: "Revenue", value: "$12.4K", icon: FaCog, color: "from-purple-400 to-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back, {user?.fullName || user?.email || "User"}!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#111827]/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 hover:border-gray-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="text-white text-lg" />
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#0B1120] border border-gray-800/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{item}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    Activity item {item}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;