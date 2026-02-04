import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./Drivers.css";

const API = "https://zyntaweb.com/alafiya/api/drivers.php";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const [form, setForm] = useState({
    driver_id: "",
    driver_name: "",
    phone: "",
    license_no: "",
    joining_date: "",
    status: "ACTIVE",
  });

  /* LOAD */
  const loadDrivers = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setDrivers(data);
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  /* FORM CHANGE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* PHONE VALIDATION */
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

    alert(isEdit ? "Driver updated successfully" : "Driver added successfully");

    resetForm();
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* DELETE */
  const deleteDriver = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    await fetch(`${API}?id=${id}`, { method: "DELETE" });
    alert("Driver deleted successfully");
    loadDrivers();
  };

  /* SEARCH */
  const filteredDrivers = drivers.filter(
    (d) =>
      d.driver_name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
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
      {/* FORM */}
      <div className="driver-form-card">
        <div className="driver-form-header">
          👤 {isEdit ? "Update Driver" : "Add New Driver"}
        </div>

        <div className="driver-form-body">
          <form onSubmit={handleSubmit}>
            <label>Driver Name *</label>
            <input
              name="driver_name"
              value={form.driver_name}
              onChange={handleChange}
              required
            />

            <label>Phone *</label>
            <PhoneInput
              country="in"
              value={form.phone}
              onChange={handlePhoneChange}
              enableSearch
              inputStyle={{ width: "100%" }}
            />
            {phoneError && <small className="error">{phoneError}</small>}

            <label>License No *</label>
            <input
              name="license_no"
              value={form.license_no}
              onChange={handleChange}
              required
            />

            <label>Joining Date *</label>
            <input
              type="date"
              name="joining_date"
              value={form.joining_date}
              onChange={handleChange}
              required
            />

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
              💾 {isEdit ? "Update Driver" : "Save Driver"}
            </button>

            {isEdit && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                ❌ Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* LIST */}
      <div className="driver-list-card">
        <div className="list-header">
          <h3>👥 LIST</h3>

          <div className="search-box">
            <input
              placeholder="Search by name or phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button>🔍</button>
          </div>
        </div>

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
                <td data-label="Phone">📞 {d.phone}</td>
                <td data-label="License">{d.license_no}</td>
                <td data-label="Joining Date">{d.joining_date}</td>
                <td data-label="Status">
                  <span className="status-active">{d.status}</span>
                </td>
                <td data-label="Actions">
                  <button className="edit-btn" onClick={() => editDriver(d)}>
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteDriver(d.driver_id)}
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
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drivers;
