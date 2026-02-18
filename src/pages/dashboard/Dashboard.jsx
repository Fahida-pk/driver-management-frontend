import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./TopNavbar";
import "./dashboard.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaMapMarkedAlt,
  FaSearch
} from "react-icons/fa";
const VEHICLE_API = "https://zyntaweb.com/alafiya/api/vehicles.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";
const TRIP_API   = "https://zyntaweb.com/alafiya/api/trip.php";
const FLOATING_API = "https://zyntaweb.com/alafiya/api/floating_trips.php";
const FIXED_API    = "https://zyntaweb.com/alafiya/api/fixed_trips.php";
const SETTLEMENT_API = "https://zyntaweb.com/alafiya/api/payment.php";

const Dashboard = () => {
  const navigate = useNavigate();

  const [vehicleCount, setVehicleCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);
const [floatingCount, setFloatingCount] = useState(0);
const [fixedCount, setFixedCount] = useState(0);
const [settlementTotal, setSettlementTotal] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) {
      navigate("/");
      return;
    }

    loadVehicleCount();
    loadDriverCount();
    loadRouteCount();
    loadFloatingCount();
loadFixedCount();
loadSettlementTotal();

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

  /* LOAD ROUTE (MASTER TRIP) COUNT */
  const loadRouteCount = async () => {
    try {
      const res = await fetch(TRIP_API);
      const data = await res.json();
      setRouteCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setRouteCount(0);
    }

  };
const loadFloatingCount = async () => {
  try {
    const res = await fetch(FLOATING_API);
    const data = await res.json();
    setFloatingCount(Array.isArray(data) ? data.length : 0);
  } catch {
    setFloatingCount(0);
  }
};
const loadFixedCount = async () => {
  try {
    const res = await fetch(FIXED_API);
    const data = await res.json();
    setFixedCount(Array.isArray(data) ? data.length : 0);
  } catch {
    setFixedCount(0);
  }
};
const loadSettlementTotal = async () => {
  try {
    const res = await fetch(SETTLEMENT_API);
    const data = await res.json();

    setSettlementTotal(Array.isArray(data) ? data.length : 0);

  } catch {
    setSettlementTotal(0);
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
                <span className="card-title">VEHICLES</span>
              </div>
              <div className="card-count">
                Total Number {vehicleCount}
              </div>
            </div>

            {/* DRIVERS */}
            <div className="card">
              <div className="card-head">
                <span className="card-icon">👨‍✈️</span>
                <span className="card-title">DRIVERS</span>
              </div>
              <div className="card-count">
                Total Number {driverCount}
              </div>
            </div>

            {/* ROUTES */}
            <div className="card">
              <div className="card-head">
                <span className="card-icon">🛣️</span>
                <span className="card-title">ROUTES</span>
              </div>
              <div className="card-count">
                Total Number {routeCount}
              </div>
            </div>
{/* FLOATING TRIP */}
<div className="card">
  <div className="card-head">
    <span className="card-icon1"><FaMapMarkedAlt /></span>
    <span className="card-title">FLOATING TRIPS</span>
  </div>
  <div className="card-count">
    Total Trips {floatingCount}
  </div>
</div>

{/* FIXED TRIP */}
<div className="card">
  <div className="card-head">
    <span className="card-icon">📋</span>
    <span className="card-title"> FIXED TRIPS</span>
  </div>
  <div className="card-count">
    Total Trips {fixedCount}
  </div>
</div>

{/* TRIP SETTLEMENT */}
{/* PAYMENT */}
<div className="card">
  <div className="card-head">
    <span className="card-icon">💳</span>
    <span className="card-title">PAYMENTS</span>
  </div>
  <div className="card-count">
    Total Payments {settlementTotal}
  </div>
</div>


          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
