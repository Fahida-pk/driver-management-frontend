import { useEffect, useState } from "react";

const TopNavbar = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r) setRole(r.toLowerCase());
  }, []);

  const openSidebar = () => {
    // 🔥 Sidebar-ine notify cheyyunnu
    window.dispatchEvent(new Event("open-sidebar"));
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="menu-icon" onClick={openSidebar}>☰</span>
        <span>Dashboard</span>
      </div>

      <div className="topbar-right">
        Welcome, <b>{role === "admin" ? "Admin" : "User"}</b>
      </div>
    </div>
  );
};

export default TopNavbar;
