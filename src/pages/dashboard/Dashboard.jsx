import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./TopNavbar";
import "./dashboard.css";

const VEHICLE_API = "https://zyntaweb.com/alafiya/api/vehicles.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";

const Dashboard = () => {
  const navigate = useNavigate();

  const [vehicleCount, setVehicleCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) {
      navigate("/");
      return;
    }

    loadVehicleCount();
    loadDriverCount();
  }, [navigate]);

  /* LOAD VEHICLE COUNT */
  const loadVehicleCount = async () => {
    try {
      const res = await fetch(VEHICLE_API);
      const data = await res.json();
      setVehicleCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setVehicleCount(0);
    }
  };

  /* LOAD DRIVER COUNT */
  const loadDriverCount = async () => {
    try {
      const res = await fetch(DRIVER_API);
      const data = await res.json();
      setDriverCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setDriverCount(0);
    }
  };

  return (
    <>
      <Topbar />

      <div className="dashboard-content">
        <div className="dashboard-inner">
          <div className="cards">

            {/* VEHICLES */}
            <div className="card">
              <div className="card-head">
                <span className="card-icon">🚚</span>
                <span className="card-title">Vehicles</span>
              </div>
              <div className="card-count">
                Total Number {vehicleCount}
              </div>
            </div>

            {/* DRIVERS */}
            <div className="card">
              <div className="card-head">
                <span className="card-icon">👨‍✈️</span>
                <span className="card-title">Drivers</span>
              </div>
              <div className="card-count">
                Total Number {driverCount}
              </div>
            </div>

            {/* ROUTES (static now) */}
            <div className="card">
              <div className="card-head">
                <span className="card-icon">🛣</span>
                <span className="card-title">Routes</span>
              </div>
              <div className="card-count">
                Total Number 5
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
