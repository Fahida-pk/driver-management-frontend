import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./Vehicles.css";

const API = "https://zyntaweb.com/alafiya/api/vehicles.php";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* MESSAGE BOX */
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const [form, setForm] = useState({
    vehicle_id: "",
    vehicle_no: "",
    vehicle_type: "",
    status: "ACTIVE",
  });

  /* LOAD DATA */
  const loadVehicles = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch {
      setVehicles([]);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  /* FORM CHANGE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.vehicle_type) {
      setMessage("Please select vehicle type ❗");
      setMessageType("error");
      autoHide();
      return;
    }

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(
      isEdit
        ? "Vehicle updated successfully ✅"
        : "Vehicle added successfully 🚗"
    );
    setMessageType("success");
    autoHide();

    resetForm();
    setShowModal(false);
    loadVehicles();
  };

  const autoHide = () => {
    setTimeout(() => setMessage(""), 3000);
  };

  const resetForm = () => {
    setForm({
      vehicle_id: "",
      vehicle_no: "",
      vehicle_type: "",
      status: "ACTIVE",
    });
    setIsEdit(false);
  };

  /* EDIT */
  const editVehicle = (vehicle) => {
    setForm(vehicle);
    setIsEdit(true);
    setShowModal(true);
  };

  /* DELETE */
  const deleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Vehicle deleted successfully ❌");
    setMessageType("success");
    autoHide();

    loadVehicles();
  };

  /* SEARCH */
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.vehicle_no?.toLowerCase().includes(search.toLowerCase()) ||
      v.vehicle_type?.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filteredVehicles.length / recordsPerPage);
  const start = (currentPage - 1) * recordsPerPage;
  const paginatedVehicles = filteredVehicles.slice(
    start,
    start + recordsPerPage
  );

  return (
    <div className="vehicle-page">
      <TopNavbar />

      {/* MESSAGE BOX */}
      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}

      <button
        className="add-vehicle-top"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        ➕ Add New Vehicle
      </button>

      <div className="vehicle-list-card">
        <div className="card-header">
          <h3>🚘 VEHICLES LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search by vehicle no or type"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

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

        {filteredVehicles.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">🚗</div>
            <p>No vehicles found.</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Vehicle No</th>
                  <th>Vehicle Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedVehicles.map((v) => (
                  <tr key={v.vehicle_id}>
                    <td data-label="Vehicle No">{v.vehicle_no}</td>
                    <td data-label="Vehicle Type">{v.vehicle_type}</td>
                    <td data-label="Status">
                      <span className="status-active">{v.status}</span>
                    </td>
                    <td data-label="Actions">
                      <button
                        className="edit-btn"
                        onClick={() => editVehicle(v)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteVehicle(v.vehicle_id)}
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
              <h3>{isEdit ? "Update Vehicle" : "Add New Vehicle"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Vehicle Number *</label>
              <input
                name="vehicle_no"
                value={form.vehicle_no}
                onChange={handleChange}
                required
              />

              <label>Vehicle Type *</label>
              <select
                name="vehicle_type"
                value={form.vehicle_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="LORRY">Lorry</option>
                <option value="TRUCK">Truck</option>
                <option value="VAN">Van</option>
              </select>

              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <button className="save-btn">
                {isEdit ? "✏️ UPDATE VEHICLE" : "💾 ADD VEHICLE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
