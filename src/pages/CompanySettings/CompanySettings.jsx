import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./CompanySettings.css";
import { FaSave, FaTrash } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { RiBuilding2Line } from "react-icons/ri";
import { MdBusiness } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FiHome } from "react-icons/fi";

const COMPANY_API = "https://zyntaweb.com/alafiya/api/company.php";

const CompanySettings = () => {
  const [companyForm, setCompanyForm] = useState({
    company_name: "",
    address: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load latest company (optional)
  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const res = await fetch(COMPANY_API);
      const data = await res.json();

      if (data && data.company_name) {
        setCompanyForm({
          company_name: data.company_name,
          address: data.address,
          phone: data.phone,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setCompanyForm({
      ...companyForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setCompanyForm((prev) => ({
      ...prev,
      phone: "+" + value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(COMPANY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Company saved successfully ✅");
        setMessageType("success");

        // 🔥 Clear form after save
        setCompanyForm({
          company_name: "",
          address: "",
          phone: "",
        });

      } else {
        setMessage("Failed to save ❌");
        setMessageType("error");
      }

    } catch {
      setMessage("Server error ❌");
      setMessageType("error");
    }

    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleClear = () => {
    setCompanyForm({
      company_name: "",
      address: "",
      phone: "",
    });
  };

  return (
    <div className="company-page">
      <TopNavbar />

      <div className="company-wrapper">
        {message && (
          <div className={`company-alert ${messageType}`}>
            {message}
          </div>
        )}

        <div className="company-card">
          <h2 className="company-title">
  <  RiBuilding2Line className="title-icon" />
  Company
</h2>


          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="company_name"
                value={companyForm.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={companyForm.address}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <PhoneInput
                country="in"
                value={companyForm.phone.replace("+", "")}
                onChange={handlePhoneChange}
                inputStyle={{ width: "100%" }}
              />
            </div>

           <div className="company-btn-wrapper">
  <button type="submit" className="company-btn save-btn">
    <FaSave className="btn-icon" />
    Save
  </button>

  <button type="button" className="company-btn clear-btn" onClick={handleClear}>
    <FaTrash className="btn-icon" />
    Clear
  </button>
</div>




          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
