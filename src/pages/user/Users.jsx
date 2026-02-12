import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus } from "react-icons/fa";
import "./Users.css";

const API = "https://zyntaweb.com/alafiya/api/users.php";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
const [modalKey, setModalKey] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const [form, setForm] = useState({
    user_id: "",
    username: "",
    password: "",
    role: "USER",
    status: "ACTIVE",
  });

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.status === "error") {
        throw new Error(data.message);
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
      setMessage(err.message || "Something went wrong");
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
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await fetch(`${API}?id=${id}`, { method: "DELETE" });

    setMessage("User deleted successfully ❌");
    setMessageType("success");

    setTimeout(() => setMessage(""), 3000);
    loadUsers();
  };

  /* ================= SEARCH ================= */
  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
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

     <button
  className="add-user-btn"
  onClick={() => {
    setIsEdit(false);
    setForm({
      user_id: "",
      username: "",
      password: "",
      role: "USER",
      status: "ACTIVE",
    });
    setModalKey(prev => prev + 1);   // 🔥 force remount
    setShowModal(true);
  }}
>
  <FaPlus /> Add New User
</button>




      {/* CARD */}
      <div className="users-card">

        {/* HEADER */}
        <div className="users-header">
          <h3>👤 USERS LIST</h3>

          <div className="search-wrapper">
            <input
              className="search-input"
              placeholder="Search by username or role"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <button
              className="search-btn"
              onClick={() => setCurrentPage(1)}
            >
              🔍
            </button>

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

        {/* TABLE */}
        {filteredUsers.length === 0 ? (
          <div className="users-empty">👤 No users found.</div>
        ) : (
          <>
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
                      <span className="users-status">
                        {u.status}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <button
                        className="users-edit"
                        onClick={() => editUser(u)}
                      >
                        ✏️
                      </button>
                      <button
                        className="users-delete"
                        onClick={() => deleteUser(u.user_id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="users-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ◀
                </button>
                <span>
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>

     {showModal && (
  <div key={modalKey} className="users-modal-overlay">


          <div className="users-modal">
            <div className="users-modal-header">
              <h3>{isEdit ? "Update User" : "Add User"}</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="users-form">
              <label>Username *</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
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
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
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

              <button type="submit" className="users-save-btn">
                {isEdit ? "UPDATE USER" : "ADD USER"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
