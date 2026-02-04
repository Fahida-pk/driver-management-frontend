import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./TopNavbar";
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) navigate("/");
  }, [navigate]);

  return (
    <>
      <Topbar />

      <div className="dashboard-content">
        <div className="dashboard-inner">
          <div className="cards">
            <div className="card">
              <div className="card-head">
                <span className="card-icon">🚚</span>
                <span className="card-title">Vehicles</span>
              </div>
              <div className="card-count">Total Number 12</div>
            </div>

            <div className="card">
              <div className="card-head">
                <span className="card-icon">👨‍✈️</span>
                <span className="card-title">Drivers</span>
              </div>
              <div className="card-count">Total Number 8</div>
            </div>

            <div className="card">
              <div className="card-head">
                <span className="card-icon">🛣</span>
                <span className="card-title">Routes</span>
              </div>
              <div className="card-count">Total Number 5</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
