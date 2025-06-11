import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import SidebarNav from "./SidebarNav";
import "../Styles/Pages.css";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const steamId = localStorage.getItem("steam_id");
  const navigate = useNavigate();

  const fetchFriends = () => {
    setLoading(true);
    apiFetch(`/api/users/${steamId}/friends_cached`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch friends");
        return res.json();
      })
      .then((data) => {
        setFriends(data.friends || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!steamId) {
      setError("No Steam ID found. Please log in.");
      setLoading(false);
      return;
    }
    fetchFriends();
  }, [steamId]);

  const handleSync = () => {
    setSyncing(true);
    setSyncMessage("");
    apiFetch(`/api/users/${steamId}/friends`, { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to sync friends from Steam");
        return res.json();
      })
      .then(() => {
        setSyncMessage("Friend list synced successfully!");
        fetchFriends();
        setSyncing(false);
        setTimeout(() => setSyncMessage(""), 2500);
      })
      .catch(() => {
        setSyncMessage("Failed to sync friends from Steam.");
        setSyncing(false);
        setTimeout(() => setSyncMessage(""), 2500);
      });
  };

  if (loading) return <div className="page-root"><div className="page-card">Loading friends...</div></div>;
  if (error) return <div className="page-root"><div className="page-card" style={{ color: "red" }}>{error}</div></div>;

  return (
    <div className="dashboard-root">
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card">
          <div className="mygames-header">
            <h2>My Friends</h2>
            <button
              className="sync-btn-small"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync Friends"}
            </button>
            {syncMessage && (
              <div style={{ color: syncMessage.includes("success") ? "#00ffe7" : "red", marginTop: 8 }}>
                {syncMessage}
              </div>
            )}
          </div>
          <ul>
            {friends.map((friend) => (
              <li key={friend.steam_id} className="mygames-list-item">
                <img
                  src={friend.avatar_url}
                  alt={friend.display_name || friend.steam_id}
                  className="avatar"
                />
                <div className="mygames-info">
                  <strong>{friend.display_name || friend.steam_id}</strong>
                  <span className="mygames-playtime">
                    {friend.friend_since ? `Friends since ${new Date(friend.friend_since * 1000).toLocaleDateString()}` : ""}
                  </span>
                </div>
                <button
                  className="compare-btn"
                  onClick={() => navigate(`/friends/${friend.steam_id}/games`, {
                    state: { display_name: friend.display_name }
                  })}
                >
                  View Games
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Friends;