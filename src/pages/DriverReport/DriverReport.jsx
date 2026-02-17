import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./DriverReport.css";
import { FaUserTie, FaFileAlt } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const REPORT_API = "https://zyntaweb.com/alafiya/api/report.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";
const COMPANY_API = "https://zyntaweb.com/alafiya/api/company.php";

const DriverReport = () => {

  /* ================= STATES ================= */
  const [drivers, setDrivers] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const [company, setCompany] = useState({
    company_name: "",
    address: "",
    phone: ""
  });

  const [companyPhoneError, setCompanyPhoneError] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  /* ================= LOAD DRIVERS ================= */
  useEffect(() => {
    fetch(DRIVER_API)
      .then(res => res.json())
      .then(data => setDrivers(Array.isArray(data) ? data : []));
  }, []);

  /* ================= LOAD COMPANY ================= */
  useEffect(() => {
    fetch(COMPANY_API)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCompany({
            company_name: data.company_name || "",
            address: data.address || "",
            phone: data.phone || ""
          });
        }
      });
  }, []);

  /* ================= PHONE VALIDATION ================= */
  const handleCompanyPhoneChange = (value, country) => {
    const fullNumber = "+" + value;
    setCompany({ ...company, phone: fullNumber });

    const localNumber = value.slice(country.dialCode.length);

    if (!localNumber) {
      setCompanyPhoneError("Phone number is required");
      return;
    }

    if (!/^\d+$/.test(localNumber)) {
      setCompanyPhoneError("Only digits allowed");
      return;
    }

    if (country.countryCode === "in") {
      if (localNumber.length !== 10) {
        setCompanyPhoneError("Indian phone number must be 10 digits");
        return;
      }
    } else {
      if (localNumber.length < 7 || localNumber.length > 12) {
        setCompanyPhoneError("Invalid phone number length");
        return;
      }
    }

    setCompanyPhoneError("");
  };

  /* ================= FILTER DRIVER ================= */
  const filteredDrivers = drivers.filter(d =>
    d.driver_name.toLowerCase().includes(driverSearch.toLowerCase())
  );

  /* ================= FETCH REPORT ================= */
  const fetchReport = async () => {
    if (!driverId || !fromDate || !toDate) {
      alert("Select driver and dates");
      return;
    }

    const res = await fetch(
      `${REPORT_API}?driver_id=${driverId}&from_date=${fromDate}&to_date=${toDate}`
    );

    const data = await res.json();
    setSummary(data.summary);
    setTransactions(data.transactions);
  };

  const handlePrint = () => window.print();

  /* ================= UI ================= */
  return (
    <div className="ledger-page-wrapper">

      <div className="no-print">
        <TopNavbar />
      </div>

      <div className="ledger-card-container">

        <h3 className="ledger-title">
          <span className="gradient-icon" style={{ marginRight: "6px" }}>
            <FaUserTie />
          </span>
          <span className="gradient-icon" style={{ marginRight: "8px" }}>
            <FaFileAlt />
          </span>
          Driver Report
        </h3>

        <button
          className="add-driver-top"
          onClick={() => setShowCompanyModal(true)}
        >
          ⚙️ Company Settings
        </button>

        {/* ================= FILTER SECTION ================= */}
        <div className="ledger-filter-section">

          <div className="driver-select-wrapper">
            <label>Driver</label>
            <div
              className="driver-select-display"
              onClick={() => setShowDriverDropdown(!showDriverDropdown)}
            >
              {driverId
                ? drivers.find(d => d.driver_id === driverId)?.driver_name
                : "Select driver"}
              <span className="arrow">▼</span>
            </div>

            {showDriverDropdown && (
              <div className="driver-dropdown-box">
                <input
                  type="text"
                  placeholder="Search driver..."
                  value={driverSearch}
                  autoFocus
                  onChange={(e) => setDriverSearch(e.target.value)}
                  className="driver-search-input"
                />
                <div className="driver-options">
                  {filteredDrivers.length > 0 ? (
                    filteredDrivers.map(d => (
                      <div
                        key={d.driver_id}
                        className="driver-option"
                        onClick={() => {
                          setDriverId(d.driver_id);
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

          <div className="filter-group">
  <label>From</label>
  <input
    type="date"
    className="ledger-input date-input"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
  />
</div>

<div className="filter-group">
  <label>To</label>
  <input
    type="date"
    className="ledger-input date-input"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
  />
</div>


          <button className="ledger-generate-btn" onClick={fetchReport}>
            Generate
          </button>

          <button className="ledger-print-btn" onClick={handlePrint}>
            Print
          </button>
        </div>

        {/* ================= REPORT TABLE ================= */}
        {summary && (
          <div className="print-section">

            <div className="print-company-header print-only">
              <h2>{company.company_name}</h2>
              <p>{company.address}</p>
              <p>Phone: {company.phone}</p>

              <h3 style={{ marginTop: "20px" }}>DRIVER SETTLEMENT</h3>

              <p>
                Driver: {
                  driverId
                    ? drivers.find(d => d.driver_id === driverId)?.driver_name
                    : "All Drivers"
                }
              </p>

              <p>
                Period: {fromDate} to {toDate}
              </p>

              <hr />
            </div>

            <div className="ledger-summary-box">
              <p><strong>Total Amount:</strong> ₹ {summary.total_credit}</p>
              <p><strong>Total Paid:</strong> ₹ {summary.total_debit}</p>
              <p><strong>Balance amount:</strong> ₹ {summary.balance}</p>
            </div>

            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Type</th>
                    <th>Total Amount</th>
                  <th>Paid Amount</th>
                
                </tr>
              </thead>
             <tbody>
  {transactions.map((t, index) => (
    <tr key={index}>
      <td data-label="Date">{t.TRANS_DATE}</td>
      <td data-label="Bill No">{t.BILL_NO}</td>
      <td data-label="Type">{t.transaction_type}</td>
      <td data-label="Total Amount">{t.DR_AMOUNT}</td>
      <td data-label="Paid Amount">{t.CR_AMOUNT}</td>
    </tr>
  ))}
</tbody>

            </table>

          </div>
        )}
      </div>

      {/* ================= COMPANY MODAL ================= */}
      {showCompanyModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Company Settings</h3>
              <button onClick={() => setShowCompanyModal(false)}>✕</button>
            </div>

            <form
              className="modal-body"
              onSubmit={async (e) => {
                e.preventDefault();

                if (companyPhoneError) {
                  alert("Please enter valid phone number");
                  return;
                }

                if (!company.phone) {
                  alert("Phone number is required");
                  return;
                }

                const res = await fetch(COMPANY_API, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(company),
                });

                const data = await res.json();

                if (data.success) {
                  alert("Company details saved ✅");
                  setShowCompanyModal(false);
                }
              }}
            >

              <label>Company Name *</label>
              <input
                value={company.company_name}
                onChange={(e) =>
                  setCompany({ ...company, company_name: e.target.value })
                }
                required
              />

              <label>Address *</label>
              <textarea
                value={company.address}
                onChange={(e) =>
                  setCompany({ ...company, address: e.target.value })
                }
                required
              />

              <label>Phone *</label>

              <PhoneInput
                country={"in"}
                value={company.phone.replace("+", "")}
                onChange={handleCompanyPhoneChange}
                enableSearch
                inputStyle={{ width: "100%" }}
              />

              {companyPhoneError && (
                <small style={{ color: "red" }}>
                  {companyPhoneError}
                </small>
              )}

              <button className="save-btn">
                💾 SAVE COMPANY
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverReport;
