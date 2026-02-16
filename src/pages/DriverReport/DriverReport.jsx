import { useState, useEffect } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import "./DriverReport.css";

const REPORT_API = "https://zyntaweb.com/alafiya/api/report.php";
const DRIVER_API = "https://zyntaweb.com/alafiya/api/drivers.php";

const DriverReport = () => {

  /* ================= STATES ================= */
  const [drivers, setDrivers] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);

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

        <h3 className="ledger-title">Driver Ledger Report</h3>

        {/* ================= FILTER ================= */}
        <div className="ledger-filter-section">

          {/* DRIVER SEARCH DROPDOWN */}
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

          {/* FROM DATE */}
          <div className="filter-group">
            <label>From</label>
            <input
              type="date"
              className="ledger-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          {/* TO DATE */}
          <div className="filter-group">
            <label>To</label>
            <input
              type="date"
              className="ledger-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button
            className="ledger-generate-btn"
            onClick={fetchReport}
          >
            Generate
          </button>

          <button
            className="ledger-print-btn"
            onClick={handlePrint}
          >
            Print
          </button>

        </div>

        {/* ================= REPORT ================= */}
        {summary && (
          <div className="print-section">

            <div className="ledger-summary-box">
              <p><strong>Total Credit:</strong> ₹ {summary.total_credit}</p>
              <p><strong>Total Debit:</strong> ₹ {summary.total_debit}</p>
              <p><strong>Balance:</strong> ₹ {summary.balance}</p>
            </div>

            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Type</th>
                  <th>Dr Amount</th>
                  <th>Cr Amount</th>
                </tr>
              </thead>
             <tbody>
  {transactions.map((t, index) => (
    <tr key={index}>
      <td data-label="Date">{t.TRANS_DATE}</td>
      <td data-label="Bill No">{t.BILL_NO}</td>
      <td data-label="Type">{t.transaction_type}</td>
      <td data-label="Dr Amount">{t.DR_AMOUNT}</td>
      <td data-label="Cr Amount">{t.CR_AMOUNT}</td>
    </tr>
  ))}
</tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
};

export default DriverReport;
