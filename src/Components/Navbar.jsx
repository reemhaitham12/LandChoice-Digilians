import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../Context/AuthContext";

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
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Map", icon: faMap },
    { to: "/explore", label: "Discover", icon: faSearch },
    { to: "/salary-fit", label: "Salary Fit", icon: faDollarSign },
    { to: "/compare", label: "Compare", icon: faProjectDiagram },
    { to: "/checklist", label: "Checklist", icon: faCheckSquare },
    { to: "/news", label: "News", icon: faRss },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${
      isActive
        ? "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#111827]/95 via-[#172554]/90 to-[#111827]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6C8FD9] to-[#f29706] flex items-center justify-center shadow-[0_0_25px_rgba(214,168,95,0.25)]">
            <FontAwesomeIcon icon={faGlobe} className="text-white text-lg" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Land<span className="text-blue-400">Choice</span>
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-2 bg-[#0f172a]/70 border border-white/10 rounded-full px-2 py-2 shadow-inner">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              <FontAwesomeIcon icon={link.icon} />
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <button className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 hover:bg-blue-500/20 transition-all duration-300 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} />
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
                className="px-5 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 hover:bg-blue-500/20 transition-all"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#6C8FD9] to-[#f29706] text-white hover:opacity-90 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="md:hidden w-11 h-11 rounded-full bg-[#0f172a]/70 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center"
        >
          <FontAwesomeIcon icon={isOpen ? faXmark : faBars} />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[520px] opacity-100 translate-y-0 mt-4" : "max-h-0 opacity-0 -translate-y-4"
        }`}
      >
        <div className="bg-[#0f172a]/95 border border-white/10 rounded-3xl p-4 shadow-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={linkClass}
              >
                <FontAwesomeIcon icon={link.icon} />
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            {user ? (
              <>
                <button  className="flex-1 h-11 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 hover:bg-blue-500/20 transition-all duration-300 flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} />
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