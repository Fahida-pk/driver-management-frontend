import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        "https://zyntaweb.com/alafiya/api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);

        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Server error. Try again");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-content" onSubmit={handleLogin}>
        <h1 className="brand">LOGIN</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login-btn">SUBMIT</button>
      </form>
    </div>
  );
};

export default Login;
