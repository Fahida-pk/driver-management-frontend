import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./FixedTrip.css";

const API = "https://zyntaweb.com/alafiya/api/fixed_trips.php";
const ROUTE_API = "https://zyntaweb.com/alafiya/api/trip.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";
const VEHICLE_API = "https://zyntaweb.com/alafiya/api/vehicles.php";

const FixedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* MESSAGE */
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

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
    status: "ACTIVE",
  };

  const [form, setForm] = useState(emptyForm);

  /* AUTO HIDE */
  const autoHide = () => setTimeout(() => setMessage(""), 3000);

  /* LOAD ALL */
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

  /* 🔥 ROUTE AUTO FILL (FIXED) */
  const handleRoute = (e) => {
    const routeId = e.target.value;

    const r = routes.find(
      x => String(x.route_id) === String(routeId)
    );
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

  /* SAVE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(
      isEdit
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

  /* EDIT */
  const editTrip = (t) => {
    setForm(t);
    setIsEdit(true);
    setShowModal(true);
  };

  /* DELETE */
  const deleteTrip = async (id) => {
    if (!window.confirm("Delete fixed trip?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Fixed trip deleted successfully ❌");
    setMessageType("success");
    autoHide();

    loadAll();
  };

  /* SEARCH */
  const filteredTrips = trips.filter(
    t =>
      t.route_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.driver_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.vehicle_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filteredTrips.length / recordsPerPage);
  const start = (currentPage - 1) * recordsPerPage;
  const paginatedTrips = filteredTrips.slice(start, start + recordsPerPage);

  return (
    <div className="driver-page">
      <TopNavbar />

      {message && (
        <div className={`message-box ${messageType}`}>{message}</div>
      )}

      <button
        className="add-driver-top"
        onClick={() => {
          setIsEdit(false);
          setForm(emptyForm);
          setShowModal(true);
        }}
      >
        ➕ Add Fixed Trip
      </button>

      <div className="driver-list-card">
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
              <button className="clear-btn" onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>
        </div>

        {paginatedTrips.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">🧾</div>
            <p>No fixed trips found.</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Doc No</th>
                  <th>Date</th>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Route</th>
                  <th>Distance</th>
                  <th>Allowance</th>
                  <th>Food</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrips.map(t => (
                  <tr key={t.fixed_trip_id}>
                    <td>{t.document_no}</td>
                    <td>{t.trip_date}</td>
                    <td>{t.driver_name}</td>
                    <td>{t.vehicle_name}</td>
                    <td>{t.route_name}</td>
                    <td>{t.distance}</td>
                    <td>{t.fixed_allowance}</td>
                    <td>{t.food_allowance}</td>
                    <td>
                      <button className="edit-btn" onClick={() => editTrip(t)}>✏️</button>
                      <button className="delete-btn" onClick={() => deleteTrip(t.fixed_trip_id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  ◀ Previous
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  ▶ Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

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
              <input
                type="date"
                name="trip_date"
                value={form.trip_date}
                onChange={handleChange}
                required
              />

              <label>Driver *</label>
              <select
                name="driver_id"
                value={form.driver_id}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {drivers.map(d => (
                  <option key={d.driver_id} value={d.driver_id}>
                    {d.driver_name}
                  </option>
                ))}
              </select>

              <label>Vehicle *</label>
              <select
                name="vehicle_id"
                value={form.vehicle_id}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {vehicles.map(v => (
                  <option key={v.vehicle_id} value={v.vehicle_id}>
                    {v.name}
                  </option>
                ))}
              </select>

              <label>Route *</label>
              <select
                name="route_id"          /* 🔥 FIX */
                value={form.route_id}
                onChange={handleRoute}
                required
              >
                <option value="">Select Route</option>
                {routes.map(r => (
                  <option key={r.route_id} value={r.route_id}>
                    {r.route_name}
                  </option>
                ))}
              </select>

              <label>Distance</label>
              <input value={form.distance} readOnly />

              <label>Fixed Allowance</label>
              <input value={form.fixed_allowance} readOnly />

              <label>Food Allowance</label>
              <input value={form.food_allowance} readOnly />

              <button className="save-btn">
                {isEdit ? "✏️ UPDATE" : "💾 SAVE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedTrips;
