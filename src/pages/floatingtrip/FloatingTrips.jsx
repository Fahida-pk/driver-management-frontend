import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaMapMarkedAlt,
  FaSearch
} from "react-icons/fa";
import "./FloatingTrip.css";

const API = "https://zyntaweb.com/alafiya/api/floating_trips.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";
const VEHICLE_API = "https://zyntaweb.com/alafiya/api/vehicles.php";

const FloatingTrips = () => {
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
// DRIVER
const [driverSearch, setDriverSearch] = useState("");
const [showDriverDropdown, setShowDriverDropdown] = useState(false);

// VEHICLE
const [vehicleSearch, setVehicleSearch] = useState("");
const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 7;
  const autoHide = () => setTimeout(() => setMessage(""), 3000);

  const emptyForm = {
  floating_trip_id: "",
  trip_date: "",
  driver_id: "",
  vehicle_id: "",
  area_name: "",
  start_time: "",
  end_time: "",
  start_km: "",
  end_km: "",
  food_allowance: "",
  remark: "",
  reference: ""
};


  const [form, setForm] = useState(emptyForm);

  /* LOAD DATA */
  const loadAll = async () => {
    try {
      const [t, d, v] = await Promise.all([
        fetch(API).then(r => r.json()),
        fetch(DRIVER_API).then(r => r.json()),
        fetch(VEHICLE_API).then(r => r.json())
      ]);
      setTrips(t);
      setDrivers(d);
      setVehicles(v);
    } catch (err) {
      console.error("Load error", err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* FORM CHANGE */
  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
const filteredDrivers = drivers.filter(d =>
  d.driver_name.toLowerCase().includes(driverSearch.toLowerCase())
);

const filteredVehicles = vehicles.filter(v =>
  v.name.toLowerCase().includes(vehicleSearch.toLowerCase())
);

  /* SAVE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.error) {
      setMessage(data.error);
      setMessageType("error");
      autoHide();
      return;
    }

    setMessage(isEdit
      ? "Floating trip updated successfully ✅"
      : "Floating trip added successfully 🎉"
    );
    setMessageType("success");
    autoHide();

    setShowModal(false);
    setIsEdit(false);
    setForm(emptyForm);
    loadAll();
  };

  /* EDIT */
  const editTrip = (t) => {
    setForm(t);
    setIsEdit(true);
    setShowModal(true);
  };

  /* DELETE */
  const deleteTrip = async (id) => {
    if (!window.confirm("Delete floating trip?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Floating trip deleted successfully ❌");
    setMessageType("success");
    autoHide();
    loadAll();
  };

  /* SEARCH */
  const filteredTrips = trips.filter(t =>
    t.area_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.driver_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.vehicle_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filteredTrips.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedTrips = filteredTrips.slice(
    startIndex,
    startIndex + recordsPerPage
  );
// CALCULATIONS
const startKm = parseFloat(form.start_km) || 0;
const endKm = parseFloat(form.end_km) || 0;

const totalDistance = endKm > startKm ? (endKm - startKm).toFixed(2) : 0;

// Example mileage rate (change if needed)
const mileageRate = 3.5;

const mileageAllowance = Math.round(
  parseFloat(totalDistance) * mileageRate
);

// TIME CALCULATION

const getTimeDifference = (start, end) => {
  if (!start || !end) return "00:00:00";

  const startTime = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);

  let diff = (endTime - startTime) / 1000;

  if (diff < 0) diff += 24 * 60 * 60;

  const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
  const seconds = String(Math.floor(diff % 60)).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const totalTime = getTimeDifference(form.start_time, form.end_time);

  return (
    <div className="floating-trip-page">
      <TopNavbar />

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-floating-trip-top"
        onClick={() => {
          setForm(emptyForm);
          setIsEdit(false);
          setShowModal(true);
        }}
      >
        <FaPlus /> Add Floating Trip
      </button>

      <div className="floating-trip-list-card">
        <div className="floating-card-header">
          <h3><FaMapMarkedAlt /> FLOATING TRIPS</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search by area / driver / vehicle"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="search-btn">🔍</button>
            {search && (
              <button className="clear-btn" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
        </div>

<div className="floating-table-scroll">
  <table className="floating-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Doc</th>
        <th>Reference</th>
        <th>Driver</th>
        <th>Vehicle</th>
        <th>Area</th>
        <th>Total Distance</th>
        <th>Total Time</th>
        <th>Total Amount</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
  {paginatedTrips.length === 0 ? (
    <tr>
      <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
        <FaMapMarkedAlt /> No floating trips found
      </td>
    </tr>
  ) : (
    paginatedTrips.map((t) => {

      const totalAmount =
        (parseFloat(t.food_allowance) || 0) +
        (parseFloat(t.mileage_allowance) || 0) +
        (parseFloat(t.time_bonus) || 0);

          return (
            <tr key={t.floating_trip_id}>
              <td data-label="Date">{t.trip_date}</td>
              <td data-label="Doc">{t.document_no}</td>
              <td data-label="Reference">{t.reference}</td>
              <td data-label="Driver">{t.driver_name}</td>
              <td data-label="Vehicle">{t.vehicle_name}</td>
              <td data-label="Area">
                <span className="area-value">{t.area_name}</span>
              </td>
              <td data-label="Total Distance">{t.total_distance}</td>
              <td data-label="Total Time">{t.total_time}</td>
              <td>
            ₹ {Math.round(totalAmount)}
          </td>


              <td data-label="Actions">
                <button
                  className="floating-edit-btn"
                  onClick={() => editTrip(t)}
                >
                  <FaEdit />
                </button>

                <button
                  className="floating-delete-btn"
                  onClick={() =>
                    deleteTrip(t.floating_trip_id)
                  }
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              ◀ Previous
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              Next ▶
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="floating-modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Edit Floating Trip" : "Add Floating Trip"}</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Date *</label>
              <input type="date" name="trip_date" value={form.trip_date} onChange={handleChange} required />

              <label>Driver *</label>

<div className="driver-row">
  <div className="driver-select-wrapper">
    <div
      className="driver-select-display"
      onClick={() => {
        setShowDriverDropdown(!showDriverDropdown);
        setShowVehicleDropdown(false);
      }}
    >
      {form.driver_id
        ? drivers.find(d => d.driver_id === form.driver_id)?.driver_name
        : "Select driver"}
      <span className="arrow">▼</span>
    </div>

    {showDriverDropdown && (
      <div className="driver-dropdown-box">
        <input
          type="text"
          placeholder="Search driver..."
          value={driverSearch}
          autoFocus
          onChange={e => setDriverSearch(e.target.value)}
          className="driver-search-input"
        />

        <div className="driver-options">
          {filteredDrivers.length ? (
            filteredDrivers.map(d => (
              <div
                key={d.driver_id}
                className="driver-option"
                onClick={() => {
                  setForm(f => ({ ...f, driver_id: d.driver_id }));
                  setShowDriverDropdown(false);
                  setDriverSearch("");
                }}
              >
                {d.driver_name}
              </div>
            ))
          ) : (
            <div className="driver-no-results">No results</div>
          )}
        </div>
      </div>
    )}
  </div>
</div>


           <label>Vehicle *</label>

<div className="driver-row">
  <div className="driver-select-wrapper">
    <div
      className="driver-select-display"
      onClick={() => {
        setShowVehicleDropdown(!showVehicleDropdown);
        setShowDriverDropdown(false);
      }}
    >
      {form.vehicle_id
        ? vehicles.find(v => v.vehicle_id === form.vehicle_id)?.name
        : "Select vehicle"}
      <span className="arrow">▼</span>
    </div>

    {showVehicleDropdown && (
      <div className="driver-dropdown-box">
        <input
          type="text"
          placeholder="Search vehicle..."
          value={vehicleSearch}
          autoFocus
          onChange={e => setVehicleSearch(e.target.value)}
          className="driver-search-input"
        />

        <div className="driver-options">
          {filteredVehicles.length ? (
            filteredVehicles.map(v => (
              <div
                key={v.vehicle_id}
                className="driver-option"
                onClick={() => {
                  setForm(f => ({ ...f, vehicle_id: v.vehicle_id }));
                  setShowVehicleDropdown(false);
                  setVehicleSearch("");
                }}
              >
                {v.name}
              </div>
            ))
          ) : (
            <div className="driver-no-results">No results</div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

              <label>Area *</label>
              <input name="area_name" value={form.area_name} onChange={handleChange} required />

              <label>Start Time *</label>
              <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required />

              <label>End Time *</label>
              <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required />

              {/* ✅ DECIMAL ENABLED */}
              <label>Start KM *</label>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                name="start_km"
                value={form.start_km}
                onChange={handleChange}
                required
              />

              <label>End KM *</label>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                name="end_km"
                value={form.end_km}
                onChange={handleChange}
                required
              />

              <label>Food Allowance *</label>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                name="food_allowance"
                value={form.food_allowance}
                onChange={handleChange}
                required
              />
<hr />
<label>Remark</label>
<input
  name="remark"
  value={form.remark}
  onChange={handleChange}
/>

<label>Reference</label>
<input
  name="reference"
  value={form.reference}
  onChange={handleChange}
/>

<label>
  Total Distance 
  <span className="formula-hint">(End KM − Start KM)</span>
</label>
<input
  type="text"
  value={totalDistance}
  readOnly
  className="calculated-box"
/>

<label>
  Mileage Allowance 
  <span className="formula-hint">(Distance × 3.5)</span>
</label>
<input
  type="text"
  value={mileageAllowance}
  readOnly
  className="calculated-box"
/>

<label>
  Total Time 
  <span className="formula-hint">(End Time − Start Time)</span>
</label>
<input
  type="text"
  value={totalTime}
  readOnly
  className="calculated-box"
/>
<label>
  Time Bonus 
  <span className="formula-hint">(Rounded Hours × 50)</span>
</label>

<input
  type="text"
 value={(() => {
  if (!form.start_time || !form.end_time) return "0.00";

  const start = new Date(`1970-01-01T${form.start_time}`);
  const end = new Date(`1970-01-01T${form.end_time}`);

  let diff = (end - start) / 1000;
  if (diff < 0) diff += 24 * 60 * 60;

  let hours = Math.floor(diff / 3600);
  let minutes = Math.floor((diff % 3600) / 60);

  // 30 min rounding
  if (minutes <= 15) {
    minutes = 0;
  } else if (minutes <= 45) {
    minutes = 30;
  } else {
    hours += 1;
    minutes = 0;
  }

  const roundedHours = hours + minutes / 60;

  // ✅ NEW LOGIC (Same as backend)
  if (roundedHours >= 6) {
    return "300.00";
  } else {
    return (roundedHours * 50).toFixed(2);
  }
})()}
  readOnly
  className="calculated-box"
/>
              <button className="save-floating-btn">
                {isEdit ? "UPDATE" : "SAVE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingTrips;
