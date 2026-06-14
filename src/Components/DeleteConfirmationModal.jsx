import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FaTrash, FaTimes } from "react-icons/fa";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Delete Post", message = "Are you sure you want to delete this post? This action cannot be undone." }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      ref={modalRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
      className="animate-fadeIn"
    >
      <div 
        className="animate-scaleIn"
        style={{
          width: "100%",
          maxWidth: "420px",
          margin: "16px",
          background: "#111827",
          border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: "20px",
          boxShadow: "0 0 40px rgba(59,130,246,0.15), 0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-white transition-colors p-1"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="px-6 pb-6 text-center">
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(220,38,38,0.15)",
              border: "1px solid rgba(220,38,38,0.2)",
            }}
          >
            <FaTrash className="text-red-500 text-2xl" />
          </div>

          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: "#F8FAFC" }}
          >
            {title}
          </h3>

          <p 
            className="text-sm mb-6 leading-relaxed"
            style={{ color: "#94A3B8" }}
          >
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-[#1F2937]"
              style={{
                background: "transparent",
                border: "1px solid #374151",
                color: "#D1D5DB",
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
              style={{
                background: "#DC2626",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#B91C1C";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#DC2626";
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeleteConfirmationModal;