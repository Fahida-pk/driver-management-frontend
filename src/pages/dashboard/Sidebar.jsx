import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("ROLE FROM STORAGE:", storedRole); // 🔥 DEBUG
    setRole(storedRole?.toLowerCase()); // normalize
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      {/* ROLE LABEL */}
      <h3>{role === "admin" ? "Admin" : "User"}</h3>

      <a href="/dashboard">Dashboard</a>

      {/* MASTER ONLY FOR ADMIN */}
      {role === "admin" && (
        <>
          <div onClick={() => setOpen(!open)} className="menu">
            Master ▾
          </div>

          {open && (
            <div className="submenu">
              <a href="/driver">Driver</a>
              <a href="/vehicle">Vehicle</a>
              <a href="/route">Route</a>
            </div>
          )}
        </>
      )}

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
