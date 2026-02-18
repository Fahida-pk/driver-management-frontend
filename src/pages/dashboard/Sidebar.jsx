import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdSwapHoriz } from "react-icons/md";
import { FaUserShield, FaUsers } from "react-icons/fa";
import { FaChartBar, FaChartPie, FaFileInvoice } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";

import {
  FaClipboardCheck,
  FaMapMarkedAlt,
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
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

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

        {/* ================= MASTER ================= */}
        <div
          className="menu-item"
          onClick={() => setOpenMenu(openMenu === "master" ? null : "master")}
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
          onClick={() => setOpenMenu(openMenu === "transaction" ? null : "transaction")}
        >
          <MdSwapHoriz />
          <span>Transaction</span>
          <FaChevronDown className={openMenu === "transaction" ? "rotate" : ""} />
        </div>

        {openMenu === "transaction" && (
          <div className="submenu">

            <Link to="/fixed-trips" onClick={() => setMobileOpen(false)}>
              <FaClipboardCheck />
              <span>Fixed Trip</span>
            </Link>

            <Link to="/floating-trips" onClick={() => setMobileOpen(false)}>
              <FaMapMarkedAlt />
              <span>Floating Trip</span>
            </Link>

            {/* ✅ Trip Settlement correctly placed under Floating */}
            <Link to="/report" onClick={() => setMobileOpen(false)}>
      <FaFileInvoice />
      <span>Trip Settlement</span>
    </Link>

          </div>
        )}

{/* ================= REPORT ================= */}
{/* ================= REPORT ================= */}
<div
  className="menu-item"
  onClick={() => setOpenMenu(openMenu === "report" ? null : "report")}
>
  <FaChartPie />
  <span>Report</span>
  <FaChevronDown className={openMenu === "report" ? "rotate" : ""} />
</div>

{openMenu === "report" && (
  <div className="submenu">

    

    <Link to="/driver-report" onClick={() => setMobileOpen(false)}>
      <FaChartBar />
      <span>Driver Report</span>
    </Link>

  </div>
)}


        {/* ================= BOTTOM SECTION ================= */}
        <div className="bottom-section">

          {role === "ADMIN" && (
            <>
              <div
                className="menu-item1"
                onClick={() => setOpenMenu(openMenu === "admin" ? null : "admin")}
              >
                <FaUserShield />
                <span>Admin</span>
                <FaChevronDown className={openMenu === "admin" ? "rotate" : ""} />
              </div>

           {openMenu === "admin" && (
  <div className="submenu">
    <Link to="/users" onClick={() => setMobileOpen(false)}>
      <FaUsers />
      <span>User</span>
    </Link>

    <Link to="/company-settings" onClick={() => setMobileOpen(false)}>
  <FaBuilding />
  <span>Company</span>
</Link>

  </div>
)}

            </>
          )}

          {/* Logout */}
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>

        </div>

      </div>
    </>
  );
};

export default Sidebar;
