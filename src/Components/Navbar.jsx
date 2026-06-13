import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../context/AuthContext";

import {
  faGlobe,
  faMap,
  faCheckSquare,
  faDollarSign,
  faProjectDiagram,
  faSearch,
  faRss,
  faRightFromBracket,
  faUser,
  faBars,
  faXmark,
  faInfoCircle,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "Admin";
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const handleProtectedNav = (path) => {
    setIsOpen(false);

    if (path === "/") {
      navigate("/");
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    navigate(path);
  };

  const navLinks = [
    { to: "/", label: "Map", icon: faMap },
    { to: "/about", label: "About", icon: faInfoCircle },
    { to: "/explore", label: "Discover", icon: faSearch },
    { to: "/salary-fit", label: "Salary Fit", icon: faDollarSign },
    { to: "/compare", label: "Compare", icon: faProjectDiagram },
    { to: "/checklist", label: "Checklist", icon: faCheckSquare },
    { to: "/news", label: "News", icon: faRss },
  ];

  const linkClass = (isActive) =>
    `flex items-center gap-2 px-3 lg:px-4 py-2 rounded-full text-sm transition-all duration-300 ${isActive
      ? "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
      : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#111827]/95 via-[#172554]/90 to-[#111827]/95 backdrop-blur-xl border-b border-white/10 px-3 sm:px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link className="flex items-center gap-3 no-underline z-50 group" to="/">
          <div className="flex items-center justify-center  transition-all duration-300">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-12 h-12 lg:w-14 lg:h-14 object-contain invert brightness-0"
            />
          </div>

          <div className="flex flex-col justify-center">

            <span className="text-white font-black text-xl lg:text-xl tracking-tighter italic italic-style font-serif">
              Land Choice
            </span>


          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-2 bg-[#0f172a]/70 border border-white/10 rounded-full px-2 py-2 shadow-inner">
          {navLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => handleProtectedNav(link.to)}
              className={linkClass(location.pathname === link.to)}
            >
              <FontAwesomeIcon icon={link.icon} />
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden xl:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() =>
                  navigate(isAdmin ? "/admin-dashboard" : "/dashboard")
                }
              >
                <FontAwesomeIcon
                  icon={isAdmin ? faUserShield : faUser}
                />
              </button>

              <button
                onClick={handleLogout}
                className="w-11 h-11 rounded-full bg-[#0f172a]/70 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 hover:bg-blue-500/20 transition-all"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#6C8FD9] to-[#f29706] text-white hover:opacity-90 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="xl:hidden w-10 h-10 rounded-full bg-[#0f172a]/70 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen
          ? "max-h-screen opacity-100 translate-y-0 mt-4"
          : "max-h-0 opacity-0 -translate-y-4"
          }`}
      >
        <div className="bg-[#0f172a]/95 border border-white/10 rounded-3xl p-4 shadow-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.to}
                onClick={() => handleProtectedNav(link.to)}
                className={linkClass(location.pathname === link.to)}
              >
                <FontAwesomeIcon icon={link.icon} />
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate(isAdmin ? "/admin-dashboard" : "/dashboard");
                  }}
                  className="flex-1 h-11 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 hover:bg-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon
                    icon={isAdmin ? faUserShield : faUser}
                  />
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 h-11 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 h-11 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 hover:bg-blue-500/20 transition-all flex items-center justify-center"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 h-11 rounded-full bg-gradient-to-r from-[#6C8FD9] to-[#f29706] text-white hover:opacity-90 transition-all flex items-center justify-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}