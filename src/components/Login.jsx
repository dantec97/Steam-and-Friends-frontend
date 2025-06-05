import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_display_name: displayName, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("account_display_name", displayName);
      localStorage.setItem("steam_id", data.steam_id); // Store steam_id for future requests
      navigate("/my_games");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color: "red"}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Account Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button
        onClick={() => {
          window.location.href = "http://127.0.0.1:5000/auth/steam";
        }}
      >
        Sign in with Steam
      </button>
    </div>
  );
};

export default Login;