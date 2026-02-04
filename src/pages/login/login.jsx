import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    setError(""); // reset old error

    try {
      const res = await fetch(
        "https://zyntaweb.com/alafiya/api/login.php", // ✅ CORRECT API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      // HTTP error check
      if (!res.ok) {
        throw new Error("HTTP error");
      }

      const data = await res.json();

      if (data.status === "success") {
        // store login info
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);

        // go to React dashboard
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
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
          placeholder="Enter username"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        <button className="login-btn" type="submit">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default Login;
