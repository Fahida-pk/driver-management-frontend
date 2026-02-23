import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import "./FixedTrip.css";

const API = "https://zyntaweb.com/alafiya/api/fixed_trips.php";
const ROUTE_API = "https://zyntaweb.com/alafiya/api/trip.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";
const VEHICLE_API = "https://zyntaweb.com/alafiya/api/vehicles.php";

const FixedTrips = () => {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
const [phoneError, setPhoneError] = useState("");

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [driverSearch, setDriverSearch] = useState("");
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
// VEHICLE
const [vehicleSearch, setVehicleSearch] = useState("");
const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

// ROUTE
const [routeSearch, setRouteSearch] = useState("");
const [showRouteDropdown, setShowRouteDropdown] = useState(false);
const validateForm = () => {
  if (!form.trip_date) return "Date is required";
  if (!form.driver_id) return "Driver is required";
  if (!form.vehicle_id) return "Vehicle is required";
  if (!form.route_id) return "Route is required";
  if (!form.distance) return "Distance missing";
  if (!form.fixed_allowance) return "Fixed allowance missing";
  if (!form.food_allowance) return "Food allowance missing";

  return "";
};
  /* pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
const validatePhone = (phone) => {
  if (!phone) return "Phone number required";

  // digits only
  if (!/^\d+$/.test(phone)) {
    return "Only digits allowed";
  }

  // India (+91) → total length = 12 (91 + 10)
  if (phone.startsWith("91")) {
    if (phone.length !== 12) {
      return "Indian phone number must be 10 digits";
    }
  }
  // Other countries
  else {
    if (phone.length < 8 || phone.length > 15) {
      return "Invalid phone number";
    }
  }

  return "";
};


  /* fixed trip form */
  const emptyForm = {
  fixed_trip_id: "",
  document_no: "",
  trip_date: "",
  driver_id: "",
  vehicle_id: "",
  route_id: "",
  route_name: "",
  distance: "",
  fixed_allowance: "",
  food_allowance: "",
  remark: "",        // ✅ ADD
  reference: "",     // ✅ ADD
  status: "ACTIVE",
};

  const [form, setForm] = useState(emptyForm);

  /* add driver form */
  const [addDriverForm, setAddDriverForm] = useState({
  driver_name: "",
  phone: "",          // full number with country code
  license_no: "",     // ✅ correct key
  joining_date: "",
  status: "ACTIVE",
});


  const autoHide = () => setTimeout(() => setMessage(""), 3000);

  /* ================= LOAD ALL ================= */
  const loadAll = async () => {
    setTrips(await (await fetch(API)).json());
    setRoutes(await (await fetch(ROUTE_API)).json());
    setDrivers(await (await fetch(DRIVER_API)).json());
    setVehicles(await (await fetch(VEHICLE_API)).json());

    const d = await (await fetch(`${API}?doc=1`)).json();
    setForm(f => ({ ...f, document_no: d.document_no }));
  };

  useEffect(() => {
    loadAll();
  }, []);

  /* ================= ROUTE AUTO FILL ================= */
  const handleRoute = (e) => {
    const r = routes.find(x => String(x.route_id) === String(e.target.value));
    if (!r) return;

    setForm(prev => ({
      ...prev,
      route_id: r.route_id,
      route_name: r.route_name,
      distance: r.fixed_distance,
      fixed_allowance: r.fixed_allowance,
      food_allowance: r.fixed_food_allowance,
    }));
  };

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  /* ================= SAVE / UPDATE ================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  const error = validateForm();

  if (error) {
    setMessage(error);
    setMessageType("error");
    autoHide();
    return;  // ❌ stop submit
  }

  await fetch(API, {
    method: isEdit ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  setMessage(isEdit 
    ? "Fixed trip updated successfully ✅" 
    : "Fixed trip added successfully 🎉"
  );

  setMessageType("success");
  autoHide();

  setShowModal(false);
  setIsEdit(false);
  setForm(emptyForm);
  loadAll();
};
  /* ================= EDIT ================= */
  const editTrip = (t) => {
    setForm(t);
    setIsEdit(true);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const deleteTrip = async (id) => {
    if (!window.confirm("Delete fixed trip?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Fixed trip deleted successfully ❌");
    setMessageType("success");
    autoHide();
    loadAll();
  };

  /* ================= SEARCH ================= */
  const filteredTrips = trips.filter(t =>
    t.route_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.driver_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.vehicle_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredTrips.length / recordsPerPage);
  const start = (currentPage - 1) * recordsPerPage;
  const paginatedTrips = filteredTrips.slice(start, start + recordsPerPage);
const filteredVehicles = vehicles.filter(v =>
  v.name.toLowerCase().includes(vehicleSearch.toLowerCase())
);

const filteredRoutes = routes.filter(r =>
  r.route_name.toLowerCase().includes(routeSearch.toLowerCase())
);

  /* ================= DRIVER SEARCH ================= */
  const filteredDrivers = drivers.filter(d =>
    d.driver_name.toLowerCase().includes(driverSearch.toLowerCase())
  );

  /* ================= ADD DRIVER (MISSING FIX) ================= */
 const handleAddDriver = async () => {
  const error = validatePhone(addDriverForm.phone);

  if (error) {
    setPhoneError(error);   // ❌ show error
    return;                // ❌ stop submit
  }

  setPhoneError("");       // ✅ clear error

  await fetch(DRIVER_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addDriverForm),
  });

  setShowDriverModal(false);

  setAddDriverForm({
    driver_name: "",
    phone: "",
   license_no: "",
    joining_date: "",
    status: "ACTIVE",
  });

  loadAll(); // refresh driver list
};


  /* ================= UI ================= */
  return (
    <div className="fixed-trip-page">
      <TopNavbar />

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-fixed-trip-top"
        onClick={() => {
          setIsEdit(false);
          setForm(emptyForm);
          setShowModal(true);
        }}
      >
        <FaPlus /> Add New Fixed Trip
      </button>

      {/* ================= LIST ================= */}
      <div className="fixed-trip-list-card">
        <div className="card-header">
          <h3>📋 FIXED TRIPS</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search by route / driver / vehicle"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="search-btn">🔍</button>

            {search && (
              <button
                className="clear-btn"
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Doc</th>
              <th>Date</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Route</th>
              <th>Distance</th>
              <th>Allowance</th>
              <th>Food</th>
              <th>Reference</th>
<th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {paginatedTrips.map(t => (
    <tr key={t.fixed_trip_id}>

      <td data-label="Doc">
        <span className="td-value">{t.document_no}</span>
      </td>

      <td data-label="Date">
        <span className="td-value">{t.trip_date}</span>
      </td>

      <td data-label="Driver">
        <span className="td-value">{t.driver_name}</span>
      </td>

      <td data-label="Vehicle">
        <span className="td-value">{t.vehicle_name}</span>
      </td>

      <td data-label="Route">
        <span className="td-value">{t.route_name}</span>
      </td>

      <td data-label="Distance">
        <span className="td-value">{t.distance}</span>
      </td>

      <td data-label="Allowance">
        <span className="td-value">{t.fixed_allowance}</span>
      </td>

      <td data-label="Food">
        <span className="td-value">{t.food_allowance}</span>
      </td>
<td data-label="Reference">
  <span className="td-value">{t.reference}</span>
</td>

<td data-label="Remark">
  <span className="td-value">{t.remark}</span>
</td>
     <td data-label="Actions">
  <button
    className="edit-btn"
    onClick={() => editTrip(t)}
    title="Edit"
  >
    ✏️
  </button>

  <button
    className="delete-btn"
    onClick={() => deleteTrip(t.fixed_trip_id)}
    title="Delete"
  > <FaTrash />
  </button>
</td>


    </tr>
  ))}
</tbody>

        </table>
      </div>
{totalPages > 1 && (
              <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>◀ Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next ▶</button>
              </div>
            )}
       

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Update Fixed Trip" : "Add Fixed Trip"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Date *</label>
              <input type="date" name="trip_date" value={form.trip_date} onChange={handleChange} required />
<label>Driver *</label>

<div className="driver-row">
  {/* LEFT : Select + dropdown */}
  <div className="driver-select-wrapper">
    {/* Selected display */}
    <div
      className="driver-select-display"
      onClick={() => setShowDriverDropdown(!showDriverDropdown)}
    >
      {form.driver_id
        ? drivers.find(d => d.driver_id === form.driver_id)?.driver_name
        : "Select driver"}
      <span className="arrow">▼</span>
    </div>

    {/* DROPDOWN */}
    {showDriverDropdown && (
      <div className="driver-dropdown-box">
        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search driver..."
          value={driverSearch}
          autoFocus
          onChange={(e) => setDriverSearch(e.target.value)}
          className="driver-search-input"
        />

        {/* OPTIONS / NO RESULTS */}
        <div className="driver-options">
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map(d => (
              <div
                key={d.driver_id}
                className="driver-option"
                onClick={() => {
                  setForm(prev => ({ ...prev, driver_id: d.driver_id }));
                  setShowDriverDropdown(false);
                  setDriverSearch("");
                }}
              >
                {d.driver_name}
              </div>
            ))
          ) : (
            <div className="driver-no-results">
              No results found
            </div>
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
      onClick={() => setShowVehicleDropdown(!showVehicleDropdown)}
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
            <div className="driver-no-results">No results found</div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

<label>Route *</label>

<div className="driver-row">
  <div className="driver-select-wrapper">
    <div
      className="driver-select-display"
      onClick={() => setShowRouteDropdown(!showRouteDropdown)}
    >
      {form.route_id
        ? routes.find(r => r.route_id === form.route_id)?.route_name
        : "Select route"}
      <span className="arrow">▼</span>
    </div>

    {showRouteDropdown && (
      <div className="driver-dropdown-box">
        <input
          type="text"
          placeholder="Search route..."
          value={routeSearch}
          autoFocus
          onChange={e => setRouteSearch(e.target.value)}
          className="driver-search-input"
        />

        <div className="driver-options">
          {filteredRoutes.length ? (
            filteredRoutes.map(r => (
              <div
                key={r.route_id}
                className="driver-option"
                onClick={() => {
                  handleRoute({ target: { value: r.route_id } });
                  setShowRouteDropdown(false);
                  setRouteSearch("");
                }}
              >
                {r.route_name}
              </div>
            ))
          ) : (
            <div className="driver-no-results">No results found</div>
          )}
        </div>
      </div>
    )}
  </div>
</div>

              <label>Distance</label>
              <input value={form.distance} readOnly />

              <label>Fixed Allowance</label>
              <input value={form.fixed_allowance} readOnly />

              <label>Food Allowance</label>
              <input value={form.food_allowance} readOnly />
<label>Reference</label>
<input
  name="reference"
  value={form.reference}
  onChange={handleChange}
/>

<label>Remark</label>
<input
  name="remark"
  value={form.remark}
  onChange={handleChange}
/>
              <button className="save-btn">{isEdit ? "✏️ UPDATE" : "💾 SAVE"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedTrips;