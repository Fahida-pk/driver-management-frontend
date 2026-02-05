import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./Vehicles.css";

const API = "https://zyntaweb.com/alafiya/api/vehicles.php";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* MESSAGE */
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  /* VEHICLE TYPES */
  const [vehicleTypes, setVehicleTypes] = useState(["LORRY", "TRUCK", "VAN"]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [newType, setNewType] = useState("");

  /* FORM */
  const [form, setForm] = useState({
    vehicle_id: "",
    name: "",
    vehicle_no: "",
    vehicle_type: "",
    status: "ACTIVE",
  });

  /* LOAD VEHICLES */
  const loadVehicles = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setVehicles(Array.isArray(data) ? data : []);
      setCurrentPage(1); // ✅ pagination refresh fix
    } catch {
      setVehicles([]);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  /* HANDLE FORM CHANGE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.vehicle_no || !form.vehicle_type) {
      setMessage("Please fill all required fields ❗");
      setMessageType("error");
      autoHide();
      return;
    }

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(isEdit ? "Vehicle updated ✅" : "Vehicle added 🚗");
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
      name: "",
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
    if (!window.confirm("Delete this vehicle?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Vehicle deleted ❌");
    setMessageType("success");
    autoHide();
    loadVehicles();
  };

  /* ADD VEHICLE TYPE */
  const saveVehicleType = () => {
    if (!newType.trim()) return;

    const type = newType.toUpperCase();
    if (vehicleTypes.includes(type)) {
      alert("Vehicle type already exists");
      return;
    }

    setVehicleTypes([...vehicleTypes, type]);
    setNewType("");
    setShowTypeModal(false);
  };

  /* SEARCH */
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
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

      {message && <div className={`message-box ${messageType}`}>{message}</div>}

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

          <input
            className="search-input"
            placeholder="Search by name, no or type"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Number</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedVehicles.map((v) => (
              <tr key={v.vehicle_id}>
                <td data-label="Name">{v.name}</td>
                <td data-label="Number">{v.vehicle_no}</td>
                <td data-label="Type">{v.vehicle_type}</td>
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

        {totalPages > 1 && currentPage <= totalPages && (
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
      </div>

      {/* VEHICLE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Update Vehicle" : "Add New Vehicle"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Vehicle Name *</label>
              <input name="name" value={form.name} onChange={handleChange} />

              <label>Vehicle Number *</label>
              <input
                name="vehicle_no"
                value={form.vehicle_no}
                onChange={handleChange}
              />

              <label>Vehicle Type *</label>
              <div className="type-row">
                <select
                  name="vehicle_type"
                  value={form.vehicle_type}
                  onChange={handleChange}
                >
                  <option value="">Select Vehicle Type</option>
                  {vehicleTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="add-type-btn"
                  onClick={() => setShowTypeModal(true)}
                >
                  ➕
                </button>
              </div>

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

      {/* ADD VEHICLE TYPE MODAL */}
      {showTypeModal && (
        <div className="modal-overlay">
          <div className="modal-box small">
            <div className="modal-header">
              <h3>Add Vehicle Type</h3>
              <button onClick={() => setShowTypeModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <label>Vehicle Type Name *</label>
              <input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Eg: MINI TRUCK"
              />

              <button className="save-btn" onClick={saveVehicleType}>
                💾 SAVE TYPE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
