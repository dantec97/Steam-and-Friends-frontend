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
    apiFetch(`/api/users/${steamId}/friends`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch friends");
        return res.json();
      })
      .then((data) => {
        setFriends(data.friends || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFriends();
  }, [steamId]);

  const handleSync = () => {
    setSyncing(true);
    apiFetch(`/api/users/${steamId}/sync_friends`, { method: "POST" })
      .then((res) => res.json())
      .then(() => {
        fetchFriends();
        setSyncing(false);
      })
      .catch(() => setSyncing(false));
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
            <div style={{ fontSize: "0.9em", color: "#7fffd4", marginTop: 4 }}>
            You only get 10 syncs per day...use them wisely!
            </div>
            <button
              className="sync-btn-small"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync Friends"}
            </button>
          </div>
          {loading ? (
            <div style={{ margin: "1em 0", color: "#555" }}>Loading friends...</div>
          ) : error ? (
            <div style={{ color: "red", margin: "1em 0" }}>
              {error}
              <br />
              <button
                className="sync-btn-small"
                onClick={handleSync}
                disabled={syncing}
                style={{ marginTop: 12 }}
              >
                {syncing ? "Syncing..." : "Try Syncing Friends"}
              </button>
            </div>
          ) : friends.length === 0 ? (
            <div style={{ margin: "1em 0", color: "#555" }}>
              No friends found.<br />
              Click <b>Sync Friends</b> above to fetch your friends from Steam.
            </div>
          ) : (
            <ul>
              {friends.map((friend) => (
                <li key={friend.steam_id} className="mygames-list-item">
                  <img
                    src={friend.avatar_url && friend.avatar_url.trim() !== "" ? friend.avatar_url : "/Logo.jpeg"}
                    alt={friend.display_name}
                    className="avatar"
                  />
                  <div className="mygames-info">
                    <strong>{friend.display_name || friend.steam_id}</strong>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Friends;