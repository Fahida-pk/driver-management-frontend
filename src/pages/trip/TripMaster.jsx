import { useEffect, useState, useRef } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./TripMaster.css";

const API = "https://zyntaweb.com/alafiya/api/trip.php";

const TripMaster = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* MESSAGE BOX */
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  /* INPUT REFS */
  const routeRef = useRef(null);
  const distanceRef = useRef(null);
  const allowanceRef = useRef(null);
  const foodRef = useRef(null);
  const statusRef = useRef(null);
  const saveBtnRef = useRef(null);

  /* FORM */
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
    try {
      const res = await fetch(API);
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch {
      setTrips([]);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    if (showModal) {
      setTimeout(() => routeRef.current?.focus(), 100);
    }
  }, [showModal]);

  /* CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

    const payload = {
      ...form,
      fixed_distance: Number(form.fixed_distance),
      fixed_allowance: Number(form.fixed_allowance),
      fixed_food_allowance: Number(form.fixed_food_allowance),
    };

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setMessage(isEdit ? "Trip updated successfully ✅" : "Trip added successfully 🎉");
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
    setForm({
      ...trip,
      fixed_distance: trip.fixed_distance ?? "",
      fixed_allowance: trip.fixed_allowance ?? "",
      fixed_food_allowance: trip.fixed_food_allowance ?? "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  /* DELETE */
  const deleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
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
    <div className="trip-page">
      <TopNavbar />

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

      <button
        className="add-trip-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        ➕ Add Master Trip
      </button>

      <div className="trip-list-card">
        <div className="card-header">
          <h3>🛣️ TRIP LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search by route name"
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

        {filteredTrips.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">🛣️</div>
            <p>No trips found.</p>
          </div>
        ) : (
          <>
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
                    <td data-label="Route">
                      <span className="td-value">{t.route_name}</span>
                    </td>

                    <td data-label="Distance">
                      <span className="td-value">{t.fixed_distance}</span>
                    </td>

                    <td data-label="Allowance">
                      <span className="td-value">{t.fixed_allowance}</span>
                    </td>

                    <td data-label="Food">
                      <span className="td-value">{t.fixed_food_allowance}</span>
                    </td>

                    <td data-label="Status">
                      <span className="td-value status-active">{t.status}</span>
                    </td>

                    <td data-label="Actions">
                      <button className="edit-btn" onClick={() => editTrip(t)}>
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
                  ◀ Previous
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
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

              <label>Fixed Distance *</label>
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

              <label>Fixed Allowance *</label>
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
                onKeyDown={(e) => handleEnter(e, saveBtnRef)}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <button ref={saveBtnRef} className="save-btn" type="submit">
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
