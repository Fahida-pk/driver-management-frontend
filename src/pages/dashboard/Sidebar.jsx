import { useState } from "react";
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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">

      {/* Dashboard */}
      <Link to="/dashboard" className="menu-item">
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
         <Link to="/drivers">
  <FaUserTie />
  <span>Driver</span>
</Link>

          <Link to="/vehicle">
            <FaTruck />
            <span>Vehicle</span>
          </Link>

          <Link to="/route">
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
  );
};

export default Sidebar;
