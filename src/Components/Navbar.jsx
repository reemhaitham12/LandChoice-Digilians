import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faGlobe,
  faMap,
  faCheckSquare,
  faDollarSign,
  faProjectDiagram,
  faSearch,
  faRss,
  faRightFromBracket,
  faUser
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <nav
      className="
      fixed top-0 left-0 right-0 z-50
      bg-gradient-to-r
      from-[#111827]/95
      via-[#172554]/90
      to-[#111827]/95
      backdrop-blur-xl
      border-b border-white/10
      px-6 py-4
    "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">

          <div
            className="
            w-11 h-11 rounded-2xl
            bg-gradient-to-br
            from-[#6C8FD9]
            to-[#f29706]
            flex items-center justify-center
            shadow-[0_0_25px_rgba(214,168,95,0.25)]
          "
          >
            <FontAwesomeIcon
              icon={faGlobe}
              className="text-white text-lg"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Land<span className="text-blue-400">Choice</span>
          </h1>
        </Link>

        {/* Links */}
        <div
          className="
          hidden md:flex items-center gap-2
          bg-[#0f172a]/70
          border border-white/10
          rounded-full
          px-2 py-2
          shadow-inner
        "
        >

          {/* Map */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive
                ? "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <FontAwesomeIcon icon={faMap} />
            Map
          </NavLink>

          {/* Discover */}
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive
                ? "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <FontAwesomeIcon icon={faSearch} />
            Discover
          </NavLink>

          {/* Salary Fit */}
          <NavLink
            to="/salary-fit"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive
                ? "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <FontAwesomeIcon icon={faDollarSign} />
            Salary Fit
          </NavLink>

          {/* Compare */}
          <NavLink
            to="/compare"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive
                ? "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <FontAwesomeIcon icon={faProjectDiagram} />
            Compare
          </NavLink>

          {/* Checklist */}
          <NavLink
            to="/checklist"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive
                ? "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <FontAwesomeIcon icon={faCheckSquare} />
            Checklist
          </NavLink>

          {/* News */}
          <NavLink
            to="/news"
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive
                ? "bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <FontAwesomeIcon icon={faRss} />
            News
          </NavLink>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">

          <button className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-400/20
        text-blue-300
        hover:bg-blue-500/20
        transition-all duration-300
        flex items-center justify-center
      "
          >
            <FontAwesomeIcon icon={faUser} />
          </button>

          <button
            className="
            w-11 h-11 rounded-full
            bg-[#0f172a]/70
            border border-white/10
            text-slate-300
            hover:text-white
            hover:bg-white/5
            transition-all
          "
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>

        </div>
      </div>
    </nav>
  );
}