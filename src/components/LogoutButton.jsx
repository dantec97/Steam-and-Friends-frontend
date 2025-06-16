import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("steam_id");
    localStorage.removeItem("account_display_name");
    localStorage.removeItem("avatar_url");
    navigate("/login");
  };

  return (
    <button
      className="logout-btn"
      style={{
        marginTop: 24,
        background: "#222",
        color: "#7fffd4",
        border: "none",
        padding: "10px 18px",
        borderRadius: 6,
        cursor: "pointer",
        width: "100%",
        fontWeight: 600,
        fontSize: "1.05em"
      }}
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;