import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdSwapHoriz } from "react-icons/md";
import {
  FaClipboardCheck,
  FaListAlt,
} from "react-icons/fa";

import {
  FaTachometerAlt,
  FaFolderOpen,
  FaUserTie,
  FaTruck,
  FaRoute,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null); // 🔑 FIX
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener("open-sidebar", handler);
    return () => window.removeEventListener("open-sidebar", handler);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="menu-item"
          onClick={() => setMobileOpen(false)}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>

        {/* ================= MASTER ================= */}
        <div
          className="menu-item"
          onClick={() =>
            setOpenMenu(openMenu === "master" ? null : "master")
          }
        >
          <FaFolderOpen />
          <span>Master</span>
          <FaChevronDown className={openMenu === "master" ? "rotate" : ""} />
        </div>

        {openMenu === "master" && (
          <div className="submenu">
            <Link to="/drivers" onClick={() => setMobileOpen(false)}>
              <FaUserTie />
              <span>Driver</span>
            </Link>

            <Link to="/vehicles" onClick={() => setMobileOpen(false)}>
              <FaTruck />
              <span>Vehicle</span>
            </Link>

            <Link to="/trips" onClick={() => setMobileOpen(false)}>
              <FaRoute />
              <span>Route</span>
            </Link>
          </div>
        )}

        {/* ================= TRANSACTION ================= */}
        <div
          className="menu-item"
          onClick={() =>
            setOpenMenu(openMenu === "transaction" ? null : "transaction")
          }
        >
          <MdSwapHoriz />
          <span>Transaction</span>
          <FaChevronDown
            className={openMenu === "transaction" ? "rotate" : ""}
          />
        </div>

        {openMenu === "transaction" && (
          <div className="submenu">
            <Link to="/fixed-trips" onClick={() => setMobileOpen(false)}>
           <FaClipboardCheck />

      <span>Fixed Trip</span>
            </Link>
          </div>
        )}

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
