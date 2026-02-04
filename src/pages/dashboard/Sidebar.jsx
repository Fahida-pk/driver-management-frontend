import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sidebar">
      <h3>User</h3>

      <a href="/dashboard">Dashboard</a>

      {/* 🔹 TEMPORARY: always show */}
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
    </div>
  );
};

export default Sidebar;
