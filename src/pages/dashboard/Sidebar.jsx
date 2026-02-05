import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFolderOpen,
  FaUserTie,
  FaTruck,
  FaRoute,
  FaSignOutAlt,
  FaChevronDown
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);          // submenu
  const [mobileOpen, setMobileOpen] = useState(false); // 🔥 mobile drawer
  const navigate = useNavigate();

  // 🔥 listen to TopNavbar ☰ click
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
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>

        {/* Dashboard */}
        <Link to="/dashboard" className="menu-item" onClick={() => setMobileOpen(false)}>
          <FaTachometerAlt />
          <span>Dashboard</span>
        </Link>

        {/* Master */}
        <div className="menu-item" onClick={() => setOpen(!open)}>
          <FaFolderOpen />
          <span>Master</span>
          <FaChevronDown className={open ? "rotate" : ""} />
        </div>

        {open && (
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
