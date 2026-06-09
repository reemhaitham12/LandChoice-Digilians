import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faExchangeAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminsTab({
  admins = [],
  openEditModal = () => {},
  switchToUser = () => {},
  handleDelete = () => {},
}) {
  if (!admins.length) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-slate-400 text-lg">
          No admins found
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {admins.map((admin) => (
        <div
          key={admin._id || admin.id}
          className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:border-blue-500/20 transition-all duration-300"
        >
          {/* Info */}
          <div>
            <h3 className="text-xl font-bold text-white">
              {admin.name}
            </h3>

            <p className="text-slate-400 mt-2">
              {admin.email}
            </p>

            <span className="inline-block mt-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {admin.role}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-5"></div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                openEditModal("admin", admin)
              }
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </button>

            <button
              onClick={() =>
                switchToUser(admin._id || admin.id)
              }
              className="px-4 py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 text-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faExchangeAlt} />
              Switch to User
            </button>

            <button
              onClick={() =>
                handleDelete(
                  "admin",
                  admin._id || admin.id
                )
              }
              className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTrash} />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}