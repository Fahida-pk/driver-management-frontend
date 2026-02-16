import React, { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./payment.css";

const API = "https://zyntaweb.com/alafiya/api/payment.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";

const Payment = () => {

  /* ================= STATES ================= */

  const [payments, setPayments] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [driverSearch, setDriverSearch] = useState("");
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [balance, setBalance] = useState(0);

  /* pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const emptyForm = {
    payment_id: "",
    payment_date: "",
    driver_id: "",
    amount: "",
    payment_mode: "CASH"
  };

  const [form, setForm] = useState(emptyForm);

  const autoHide = () => setTimeout(() => setMessage(""), 3000);

  /* ================= LOAD ================= */

  const loadPayments = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setPayments(Array.isArray(data) ? data : []);
  };

  const loadDrivers = async () => {
    const res = await fetch(DRIVER_API);
    const data = await res.json();
    setDrivers(Array.isArray(data) ? data : []);
  };

  const loadBalance = async (driverId) => {
    if (!driverId) {
      setBalance(0);
      return;
    }

    const res = await fetch(`${API}?driver_id=${driverId}`);
    const data = await res.json();
    setBalance(data.balance || 0);
  };

  useEffect(() => {
    loadPayments();
    loadDrivers();
  }, []);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.payment_date || !form.driver_id || !form.amount) {
    setMessage("Please fill all required fields ❗");
    setMessageType("error");
    autoHide();
    return;
  }

  try {
    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setMessage(
      isEdit
        ? "Payment updated successfully ✅"
        : "Payment added successfully 🎉"
    );
    setMessageType("success");
    autoHide();

    // ⭐ Reload updated balance BEFORE clearing form
    await loadBalance(form.driver_id);

    // Reload table
    loadPayments();

    // Reset form & close modal
    setShowModal(false);
    setIsEdit(false);
    setForm(emptyForm);

  } catch (err) {
    console.error(err);
    setMessage("Something went wrong ❌");
    setMessageType("error");
    autoHide();
  }
};
useEffect(() => {
  if (!isEdit) {
    if (form.driver_id) {
      loadBalance(form.driver_id);
    } else {
      setBalance(0);
    }
  }
}, [form.driver_id]);



  const handleEdit = async (payment) => {

  setIsEdit(true);
  setShowModal(true);

  try {

    const res = await fetch(`${API}?driver_id=${payment.driver_id}`);
    const data = await res.json();

    const apiBalance = parseFloat(data.balance || 0);
    const editingAmount = parseFloat(payment.amount || 0);

    // ⭐ Add editing amount back
    const adjustedBalance = apiBalance + editingAmount;

    // Set balance state (IMPORTANT)
    setBalance(adjustedBalance);

    // Set form
    setForm(payment);

  } catch (err) {
    console.error("Balance fetch error:", err);
  }
};

  /* ================= DELETE ================= */

  const deletePayment = async (id) => {
    if (!window.confirm("Delete payment?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Payment deleted successfully ❌");
    setMessageType("success");
    autoHide();

    loadPayments();
  };

  /* ================= SEARCH ================= */

  const filtered = payments.filter(p =>
    p.driver_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.document_no?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const start = (currentPage - 1) * recordsPerPage;
  const paginated = filtered.slice(start, start + recordsPerPage);

  const filteredDrivers = drivers.filter(d =>
    d.driver_name.toLowerCase().includes(driverSearch.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="payment-page">
      <TopNavbar />

      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}

      <button
        className="add-payment-top"
        onClick={() => {
          setIsEdit(false);
          setForm(emptyForm);
          setBalance(0);
          setShowModal(true);
        }}
      >
        <FaPlus /> Add New Payment
      </button>

      {/* ================= LIST ================= */}
      <div className="payment-list-card">
        <div className="card-header">
          <h3>💳 Payment LIST</h3>

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
              <th>Amount</th>
              <th>Balance</th>
              <th>Mode</th>
              <th>Actions</th>
            </tr>
          </thead>

         <tbody>
  {paginated.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        No payments found
      </td>
    </tr>
  ) : (
    paginated.map(p => (
      <tr key={p.payment_id}>
        <td>{p.document_no}</td>
        <td>{p.payment_date}</td>
        <td>{p.driver_name}</td>
        <td>{Number(p.amount).toFixed(2)}</td>
        <td>{Number(p.current_balance || 0).toFixed(2)}</td>
        <td>{p.payment_mode}</td>
        <td>
<button className="edit-btn" onClick={() => handleEdit(p)}>
            <FaEdit />
          </button>
          <button className="delete-btn" onClick={() => deletePayment(p.payment_id)}>
            <FaTrash />
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}>
            ◀ Previous
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}>
            Next ▶
          </button>
        </div>
      )}

      {/* ================= MODAL ================= */}

      {showModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-box">

            <div className="modal-header">
              <h3>{isEdit ? "Update Payment" : "Add Payment"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">

              <label>Date *</label>
              <input
                type="date"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
                required
              />

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
  ? drivers.find(d => String(d.driver_id) === String(form.driver_id))?.driver_name
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
              <label>Current Balance</label>
              <input
                value={Number(balance).toFixed(2)}
                readOnly
                style={{ backgroundColor: "#e6f7e6" }}
              />

              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
              />

              <label>Mode</label>
              <select
                name="payment_mode"
                value={form.payment_mode}
                onChange={handleChange}
              >
                <option value="CASH">Cash</option>
                <option value="BANK">Bank</option>
              </select>

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

export default Payment;
