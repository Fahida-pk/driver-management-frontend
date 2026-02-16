import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./payment.css";

const API = "https://zyntaweb.com/alafiya/api/payment.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";

const Payment = () => {

  const [payments, setPayments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  /* ✅ MESSAGE SYSTEM */
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [form, setForm] = useState({
    payment_id: "",
    payment_date: "",
    driver_id: "",
    amount: "",
    payment_mode: "CASH"
  });

  /* ================= LOAD PAYMENTS ================= */
  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD DRIVERS ================= */
  const loadDrivers = async () => {
    try {
      const res = await fetch(DRIVER_API);
      const data = await res.json();
      setDrivers(Array.isArray(data) ? data : []);
    } catch {
      setDrivers([]);
    }
  };

  /* ================= LOAD BALANCE ================= */
  const loadBalance = async (driverId) => {
    if (!driverId) {
      setBalance(0);
      return;
    }

    try {
      const res = await fetch(`${API}?driver_id=${driverId}`);
      const data = await res.json();
      setBalance(data.balance || 0);
    } catch {
      setBalance(0);
    }
  };

  useEffect(() => {
    loadPayments();
    loadDrivers();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "driver_id") {
      loadBalance(value);
    }
  };

  /* ================= AUTO HIDE MESSAGE ================= */
  const autoHide = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  /* ================= SAVE ================= */
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

      setMessage(isEdit ? "Payment updated ✅" : "Payment added successfully 💳");
      setMessageType("success");
      autoHide();

      setShowModal(false);
      setIsEdit(false);
      setBalance(0);

      setForm({
        payment_id: "",
        payment_date: "",
        driver_id: "",
        amount: "",
        payment_mode: "CASH"
      });

      loadPayments();

    } catch {
      setMessage("Something went wrong ❌");
      setMessageType("error");
      autoHide();
    }
  };

  /* ================= EDIT ================= */
  const editPayment = (p) => {
    setForm({
      payment_id: p.payment_id,
      payment_date: p.payment_date,
      driver_id: p.driver_id,
      amount: p.amount,
      payment_mode: p.payment_mode
    });

    loadBalance(p.driver_id);
    setIsEdit(true);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const deletePayment = async (id) => {
    if (!window.confirm("Delete payment?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("Payment deleted ❌");
    setMessageType("success");
    autoHide();

    loadPayments();
  };

  const filtered = payments.filter(p =>
    p.document_no?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="payment-page">
      <TopNavbar />

      {/* ✅ MESSAGE BOX */}
      {message && (
        <div className={`message-box ${messageType}`}>
          {message}
        </div>
      )}

      <button
        className="add-payment-top"
        onClick={() => {
          setShowModal(true);
          setIsEdit(false);
          setBalance(0);
        }}
      >
        <FaPlus /> Add Payment
      </button>

      <div className="payment-list-card">

        <div className="card-header">
          <h3>💳 PAYMENTS LIST</h3>

           {/* 🔍 SEARCH WITH ICON */}
          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search by name, doc no "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="search-btn" type="button">🔍</button>

            {search && (
              <button
                className="clear-btn"
                type="button"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <table className="payment-table">
          <thead>
            <tr>
              <th>Doc No</th>
              <th>Date</th>
              <th>Driver</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Mode</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" align="center">Loading...</td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan="7" align="center">💳 No payments found</td>
              </tr>
            )}

            {!loading && filtered.map(p => (
              <tr key={p.payment_id}>
                <td data-label="Doc No">{p.document_no}</td>
                <td data-label="Date">{p.payment_date}</td>
                <td data-label="Driver">{p.driver_name}</td>
                <td data-label="Amount">{Number(p.amount).toFixed(2)}</td>
                <td data-label="Balance">
                  {Number(p.current_balance || 0).toFixed(2)}
                </td>
                <td data-label="Mode">{p.payment_mode}</td>
                <td data-label="Actions">
                  <button
                    className="payment-edit-btn"
                    onClick={() => editPayment(p)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="payment-delete-btn"
                    onClick={() => deletePayment(p.payment_id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-box">

            <div className="modal-header">
              <h3>{isEdit ? "Update Payment" : "Add Payment"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">

              <label>Date</label>
              <input
                type="date"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
                required
              />

              <label>Driver</label>
              <select
                name="driver_id"
                value={form.driver_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Driver</option>
                {drivers.map(d => (
                  <option key={d.driver_id} value={d.driver_id}>
                    {d.driver_name}
                  </option>
                ))}
              </select>

              <label>Current Balance</label>
              <input
                type="text"
                value={Number(balance).toFixed(2)}
                readOnly
                style={{ backgroundColor: "#e6f7e6" }}
              />

              <label>Amount</label>
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

              <button className="payment-save-btn">
                {isEdit ? "Update Payment" : "Save Payment"}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Payment;
