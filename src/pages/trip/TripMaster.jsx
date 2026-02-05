import { useEffect, useState, useRef } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./TripMaster.css";

const API = "https://zyntaweb.com/alafiya/api/trip.php";

const TripMaster = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  /* INPUT REFS (ENTER KEY) */
  const routeRef = useRef(null);
  const distanceRef = useRef(null);
  const allowanceRef = useRef(null);
  const foodRef = useRef(null);
  const statusRef = useRef(null);

  const [form, setForm] = useState({
    route_id: "",
    route_name: "",
    fixed_distance: "",
    fixed_allowance: "",
    fixed_food_allowance: "",
    status: "ACTIVE",
  });

  /* LOAD */
  const loadTrips = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTrips(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  /* CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "fixed_distance" ||
      name === "fixed_allowance" ||
      name === "fixed_food_allowance"
    ) {
      setForm({ ...form, [name]: value === "" ? "" : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* ENTER KEY */
  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(isEdit ? "Trip updated ✅" : "Trip added 🎉");
    setMessageType("success");
    setTimeout(() => setMessage(""), 3000);

    resetForm();
    setShowModal(false);
    loadTrips();
  };

  const resetForm = () => {
    setForm({
      route_id: "",
      route_name: "",
      fixed_distance: "",
      fixed_allowance: "",
      fixed_food_allowance: "",
      status: "ACTIVE",
    });
    setIsEdit(false);
  };

  /* EDIT */
  const editTrip = (trip) => {
    setForm(trip);
    setIsEdit(true);
    setShowModal(true);
  };

  /* DELETE */
  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    await fetch(`${API}?id=${id}`, { method: "DELETE" });
    loadTrips();
  };

  /* SEARCH */
  const filteredTrips = trips.filter((t) =>
    t.route_name?.toLowerCase().includes(search.toLowerCase())
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
          resetForm();
          setShowModal(true);
          setTimeout(() => routeRef.current?.focus(), 100);
        }}
      >
        ➕ Add Master Trip
      </button>

      <div className="driver-list-card">
        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Distance</th>
              <th>Allowance</th>
              <th>Food</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTrips.map((t) => (
              <tr key={t.route_id}>
                <td>{t.route_name}</td>
                <td>{t.fixed_distance}</td>
                <td>{t.fixed_allowance}</td>
                <td>{t.fixed_food_allowance}</td>
                <td>
                  <span className="status-active">{t.status}</span>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editTrip(t)}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTrip(t.route_id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ◀
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Update Trip" : "Add Master Trip"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Route Name *</label>
              <input
                ref={routeRef}
                name="route_name"
                value={form.route_name}
                onChange={handleChange}
                onKeyDown={(e) => handleEnter(e, distanceRef)}
                required
              />

              <label>Fixed Distance</label>
              <input
                ref={distanceRef}
                type="number"
                step="0.01"
                name="fixed_distance"
                value={form.fixed_distance}
                onChange={handleChange}
                onKeyDown={(e) => handleEnter(e, allowanceRef)}
                required
              />

              <label>Fixed Allowance</label>
              <input
                ref={allowanceRef}
                type="number"
                step="0.01"
                name="fixed_allowance"
                value={form.fixed_allowance}
                onChange={handleChange}
                onKeyDown={(e) => handleEnter(e, foodRef)}
                required
              />

              <label>Fixed Food Allowance</label>
              <input
                ref={foodRef}
                type="number"
                step="0.01"
                name="fixed_food_allowance"
                value={form.fixed_food_allowance}
                onChange={handleChange}
                onKeyDown={(e) => handleEnter(e, statusRef)}
              />

              <label>Status</label>
              <select
                ref={statusRef}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <button className="save-btn">
                {isEdit ? "✏️ UPDATE TRIP" : "💾 ADD TRIP"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripMaster;
