import { useEffect, useState } from "react";

const TopNavbar = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("role");
    if (r) setRole(r.toLowerCase());
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-left">
        ☰ <span>Dashboard</span>
      </div>

      <div className="topbar-right">
        Welcome, <b>{role === "admin" ? "Admin" : "User"}</b>
      </div>
    </div>
  );
};

export default TopNavbar;
