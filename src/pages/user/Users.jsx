import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import "./Users.css";

const API = "https://zyntaweb.com/alafiya/api/users.php";
const COMPANY_API = "https://zyntaweb.com/alafiya/api/company.php";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
const [companyPhoneError, setCompanyPhoneError] = useState("");
const emptyUserForm = {
  user_id: "",
  username: "",
  password: "",
  role: "USER",
  status: "ACTIVE",
};

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
const [showCompanyModal, setShowCompanyModal] = useState(false);

const [companyForm, setCompanyForm] = useState({
  company_name: "",
  address: "",
  phone: "",
});

 const [form, setForm] = useState(emptyUserForm);

const handleCompanyPhoneChange = (value, country) => {
  const fullNumber = "+" + value;
  setCompanyForm({ ...companyForm, phone: fullNumber });

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

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);
const loadCompany = async () => {
  try {
    const res = await fetch(COMPANY_API);
    const data = await res.json();
    if (data) {
      setCompanyForm({
        company_name: data.company_name || "",
        address: data.address || "",
        phone: data.phone || "",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

  /* ================= HANDLE CHANGE ================= */
const handleCompanyChange = (e) => {
  setCompanyForm({
    ...companyForm,
    [e.target.name]: e.target.value,
  });
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.username || !form.password) {
    setMessage("All fields are required");
    setMessageType("error");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json(); // ✅ Read only once

    if (!res.ok || data.status === "error") {
  setMessage(data.message || "Username already exists ❌");
  setMessageType("error");
  setLoading(false);

  setTimeout(() => {
    setMessage("");
  }, 3000);

  return;
}


    setMessage(
      isEdit
        ? "User updated successfully ✅"
        : "User added successfully 🎉"
    );
    setMessageType("success");

    resetForm();
    setShowModal(false);
    loadUsers();

  } catch (err) {
    setMessage("Server error. Please try again.");
    setMessageType("error");
  }

  setLoading(false);
  setTimeout(() => setMessage(""), 3000);
};
const saveCompanySettings = async (e) => {
  e.preventDefault();

  if (companyPhoneError) {
    setMessage("Please enter valid phone number ❌");
    setMessageType("error");
    return;
  }

  if (!companyForm.phone) {
    setMessage("Phone number is required ❌");
    setMessageType("error");
    return;
  }

  try {
    const res = await fetch(COMPANY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyForm),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Company settings saved successfully ✅");
      setMessageType("success");
      setShowCompanyModal(false);
    }
  } catch {
    setMessage("Failed to save company settings ❌");
    setMessageType("error");
  }

  setTimeout(() => setMessage(""), 3000);
};


  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setForm({
      user_id: "",
      username: "",
      password: "",
      role: "USER",
      status: "ACTIVE",
    });
    setIsEdit(false);
  };

  /* ================= EDIT ================= */
  const editUser = (user) => {
    setForm(user);
    setIsEdit(true);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const deleteUser = async (user) => {
    if (user.username === "code@123") {
      setMessage("Default admin cannot be deleted ❌");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (!window.confirm("Delete this user?")) return;

    try {
      const res = await fetch(`${API}?id=${user.user_id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.status === "error") {
        setMessage(data.message);
        setMessageType("error");
      } else {
        setMessage("User deleted successfully ❌");
        setMessageType("success");
        loadUsers();
      }

    } catch {
      setMessage("Delete failed");
      setMessageType("error");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  /* ================= SEARCH ================= */
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const start = (currentPage - 1) * recordsPerPage;
  const paginatedUsers = filteredUsers.slice(start, start + recordsPerPage);

  return (
    <div className="users-page">
      <TopNavbar />

      {message && (
        <div className={`users-message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="users-top-actions">

  <button
    className="add-user-btn"
    onClick={() => {
      resetForm();
      setShowModal(true);
    }}
  >
    <FaPlus /> Add New User
  </button>

  <button
    className="add-user-btn"
    onClick={() => {
      loadCompany();
      setShowCompanyModal(true);
    }}
  >
    🏢 Company Settings
  </button>

</div>


      <div className="users-card">
        <div className="users-header">
          <h3>👤 USERS LIST</h3>

          <input
            className="search-input"
            placeholder="Search by username or role"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="users-empty">👤 No users found.</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {paginatedUsers.map((u) => (
    <tr key={u.user_id}>
      <td data-label="Username">{u.username}</td>
      <td data-label="Role">{u.role}</td>
      <td data-label="Status">
        <span className="users-status">{u.status}</span>
      </td>
      <td data-label="Actions">
        <button
          className="users-edit"
          onClick={() => editUser(u)}
        >
          ✏️
        </button>

        {u.username !== "code@123" && (
          <button
            className="users-delete"
            onClick={() => deleteUser(u)}
          >
            <FaTrash />
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>

          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="users-modal-overlay">
          <div className="users-modal">
         <div className="users-modal-header">
  <h3>{isEdit ? "Update User" : "Add User"}</h3>
  <button
    onClick={() => {
      resetForm();        // 👈 ADD THIS
      setShowModal(false);
    }}
  >
    ✕
  </button>
</div>

            <form onSubmit={handleSubmit} className="users-form">
              <label>Username *</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                disabled={isEdit && form.username === "code@123"}
              />

              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <label>Role *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={isEdit && form.username === "code@123"}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>

              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={isEdit && form.username === "code@123"}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <button
                type="submit"
                className="users-save-btn"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isEdit
                  ? "UPDATE USER"
                  : "ADD USER"}
              </button>
            </form>
          </div>
        </div>
      )}
      {showCompanyModal && (
  <div className="users-modal-overlay">
    <div className="users-modal">
      <div className="users-modal-header">
        <h3>Company Settings</h3>
        <button onClick={() => setShowCompanyModal(false)}>✕</button>
      </div>

      <form onSubmit={saveCompanySettings} className="users-form">
        <label>Company Name *</label>
        <input
          name="company_name"
          value={companyForm.company_name}
          onChange={handleCompanyChange}
          required
        />

        <label>Address *</label>
        <textarea
          name="address"
          value={companyForm.address}
          onChange={handleCompanyChange}
          required
        />

        <label>Phone *</label>
        <PhoneInput
  country={"in"}
  value={companyForm.phone.replace("+", "")}
  onChange={handleCompanyPhoneChange}
  enableSearch
  inputStyle={{ width: "100%" }}
/>

{companyPhoneError && (
  <small style={{ color: "red" }}>
    {companyPhoneError}
  </small>
)}


        <button type="submit" className="users-save-btn">
          SAVE SETTINGS
        </button>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Users;
