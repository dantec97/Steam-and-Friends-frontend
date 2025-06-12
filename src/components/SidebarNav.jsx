import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../Styles/Dashboard.css";

const SidebarNav = () => {
  const steamId = localStorage.getItem("steam_id");
  const displayName = localStorage.getItem("account_display_name") || "Player";
  const avatarUrl = localStorage.getItem("avatar_url") || "/Logo.jpeg";
  const location = useLocation();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo-title">
        <img src="/Logo.jpeg" alt="Steam and Friends" className="dashboard-logo-img" />
        <span className="dashboard-logo-text">Steam and Friends</span>
      </div>
      <div className="dashboard-profile">
        <img src={avatarUrl} alt="Avatar" />
        <div>
          <div className="dashboard-name">{displayName}</div>
          <div className="dashboard-steamid">{steamId}</div>
        </div>
      </div>
      <nav>
        <ul>
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={location.pathname === "/my_games" ? "active" : ""}>
            <Link to="/my_games">My Games</Link>
          </li>
          <li className={location.pathname === "/friends" ? "active" : ""}>
            <Link to="/friends">Friends</Link>
          </li>
          <li className={location.pathname === "/groups" ? "active" : ""}>
            <Link to="/groups">Groups</Link>
          </li>
          <li className={location.pathname.startsWith("/friends/") && location.pathname.endsWith("/games") ? "active" : ""}>
            <Link to="/friends/games">Friend's Games</Link>
          </li>
          <li className={location.pathname === "/games/1/comparison" ? "active" : ""}>
            <Link to="/games/1/comparison">Game Comparison</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarNav;