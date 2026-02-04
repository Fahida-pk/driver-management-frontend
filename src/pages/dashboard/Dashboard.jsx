import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <h2>Dashboard</h2>

        <div className="cards">
          <div className="card">
            🚚 Vehicles <br />
            <b>12</b>
          </div>
          <div className="card">
            👨‍✈️ Drivers <br />
            <b>8</b>
          </div>
          <div className="card">
            🛣 Routes <br />
            <b>5</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
