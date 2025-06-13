import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import SidebarNav from "./SidebarNav";
import "../Styles/Pages.css";
import steamLogo from "/steam-logo.png"; // Make sure this path is correct

const Login = () => {
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await apiFetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_display_name: displayName, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("account_display_name", displayName);
      localStorage.setItem("steam_id", data.steam_id);
      navigate("/my_games");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="dashboard-root">
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <h2 style={{ marginBottom: 32, fontSize: "2.2rem", letterSpacing: 1 }}>Sign in with Steam</h2>
          <button
            className="steam-login-btn"
            onClick={() => {
              window.location.href = "http://127.0.0.1:5000/auth/steam";
            }}
          >
            <img src={steamLogo} alt="Steam" className="steam-login-logo" />
            <span>Sign in with Steam</span>
          </button>
          <p style={{ marginTop: 32, color: "#7fffd4", fontSize: "1.08em" }}>
            Secure login powered by Steam. We don't store your password :)
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;