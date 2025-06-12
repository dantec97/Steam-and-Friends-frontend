import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Styles/Dashboard.css";

const SidebarNav = () => {
  const steamId = localStorage.getItem("steam_id");
  const displayName = localStorage.getItem("account_display_name") || "Player";
  const avatarUrl = localStorage.getItem("avatar_url") || "/Logo.jpeg";
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close menu on nav click (mobile)
  const handleNavClick = () => setOpen(false);

  return (
    <>
      {/* Mobile Top Nav */}
      <div className="mobile-top-nav">
        <button
          className="hamburger-btn"
          aria-label="Open navigation"
          onClick={() => setOpen(o => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="mobile-logo-wrap">
          <img src="/Logo.jpeg" alt="Steam and Friends" className="mobile-logo-img" />
          <span className="mobile-logo-text">Steam and Friends</span>
        </div>
      </div>
      <aside className={`dashboard-sidebar${open ? " open" : ""}`}>
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
              <Link to="/dashboard" onClick={handleNavClick}>Dashboard</Link>
            </li>
            <li className={location.pathname === "/my_games" ? "active" : ""}>
              <Link to="/my_games" onClick={handleNavClick}>My Games</Link>
            </li>
            <li className={location.pathname === "/friends" ? "active" : ""}>
              <Link to="/friends" onClick={handleNavClick}>Friends</Link>
            </li>
            <li className={location.pathname === "/groups" ? "active" : ""}>
              <Link to="/groups" onClick={handleNavClick}>Groups</Link>
            </li>
            <li className={location.pathname.startsWith("/friends/") && location.pathname.endsWith("/games") ? "active" : ""}>
              <Link to="/friends/games" onClick={handleNavClick}>Friend's Games</Link>
            </li>
            <li className={location.pathname === "/games/1/comparison" ? "active" : ""}>
              <Link to="/games/1/comparison" onClick={handleNavClick}>Game Comparison</Link>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Overlay for closing menu */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
    </>
  );
};

export default SidebarNav;