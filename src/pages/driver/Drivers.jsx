import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Drivers.css";

const API = "https://zyntaweb.com/alafiya/api/drivers.php";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [showModal, setShowModal] = useState(false);

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const [form, setForm] = useState({
    driver_id: "",
    driver_name: "",
    phone: "",
    license_no: "",
    joining_date: "",
    status: "ACTIVE",
  });

  /* LOAD DATA */
  const loadDrivers = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      setDrivers([]);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  /* FORM CHANGE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* PHONE */
  const handlePhoneChange = (value, country) => {
    const fullNumber = "+" + value;
    setForm({ ...form, phone: fullNumber });

    const local = value.slice(country.dialCode.length);

    if (!local) setPhoneError("Phone number is required");
    else if (!/^\d+$/.test(local)) setPhoneError("Only digits allowed");
    else if (local.length < 7 || local.length > 12)
      setPhoneError("Invalid phone number");
    else setPhoneError("");
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneError || !form.phone) {
      alert("Enter valid phone number");
      return;
    }

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    setShowModal(false);
    loadDrivers();
  };

  const resetForm = () => {
    setForm({
      driver_id: "",
      driver_name: "",
      phone: "",
      license_no: "",
      joining_date: "",
      status: "ACTIVE",
    });
    setIsEdit(false);
    setPhoneError("");
  };

  /* EDIT */
  const editDriver = (driver) => {
    setForm(driver);
    setIsEdit(true);
    setShowModal(true);
  };

  /* DELETE */
  const deleteDriver = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    await fetch(`${API}?id=${id}`, { method: "DELETE" });
    loadDrivers();
  };

  /* SEARCH FILTER */
  const filteredDrivers = drivers.filter(
    (d) =>
      d.driver_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.phone?.toLowerCase().includes(search.toLowerCase())
  );

  /* PAGINATION */
  const totalPages = Math.ceil(filteredDrivers.length / recordsPerPage);
  const start = (currentPage - 1) * recordsPerPage;
  const paginatedDrivers = filteredDrivers.slice(
    start,
    start + recordsPerPage
  );

  return (
    <div className="driver-page">
    <TopNavbar />

      <button className="add-driver-top" onClick={() => {
        resetForm();
        setShowModal(true);
      }}>
        ➕ Add New Driver
      </button>

      <div className="driver-list-card">

        <div className="card-header">
          <h3>👥 DRIVERS LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search by name or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <button className="search-btn" title="Search">🔍</button>

            {search && (
              <button
                className="clear-btn"
                title="Clear"
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

        {/* NO DATA MESSAGE */}
        {filteredDrivers.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">🚗</div>
            <p>No drivers found.</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>License</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedDrivers.map((d) => (
                  <tr key={d.driver_id}>
                    <td data-label="Name">{d.driver_name}</td>
                    <td data-label="Phone">{d.phone}</td>
                    <td data-label="License">{d.license_no}</td>
                    <td data-label="Joining Date">{d.joining_date}</td>
                    <td data-label="Status">
                      <span className="status-active">{d.status}</span>
                    </td>
                    <td data-label="Actions">
                      <button className="edit-btn" onClick={() => editDriver(d)}>✏️</button>
                      <button className="delete-btn" onClick={() => deleteDriver(d.driver_id)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>◀ Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>▶  Next</button>
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
              <h3>{isEdit ? "Update Driver" : "Add New Driver"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <label>Driver Name *</label>
              <input name="driver_name" value={form.driver_name} onChange={handleChange} required />

              <label>Phone *</label>
              <PhoneInput
                country="in"
                value={form.phone}
                onChange={handlePhoneChange}
                inputStyle={{ width: "100%" }}
              />
              {phoneError && <small className="error">{phoneError}</small>}

              <label>License *</label>
              <input name="license_no" value={form.license_no} onChange={handleChange} required />

              <label>Joining Date *</label>
              <input type="date" name="joining_date" value={form.joining_date} onChange={handleChange} required />

              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <button className="save-btn">💾 Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;
