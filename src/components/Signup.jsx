import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [steamId, setSteamId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        steam_id: steamId,
        account_display_name: displayName, // <-- updated key
        password,
      }),
    });
    if (res.ok) {
      navigate("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Signup failed");
    }
  };

  return (
    <div>
      {/* <h2>Sign Up</h2>
      {error && <p style={{color: "red"}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Steam ID"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nickname for our site :)"
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
        <button type="submit">Sign Up</button>
      </form> */}
      <button
        onClick={() => {
          window.location.href = "http://127.0.0.1:5000/auth/steam";
        }}
        style={{ marginTop: 16 }}
      >
        Sign up with Steam
      </button>
    </div>
  );
};

export default Signup;