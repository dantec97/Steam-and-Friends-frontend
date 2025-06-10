import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState(""); // <-- NEW
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
    setSyncMessage(""); // clear previous message
    apiFetch(`/api/users/${steamId}/friends`, { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to sync friends from Steam");
        return res.json();
      })
      .then(() => {
        setSyncMessage("Friend list synced successfully!");
        fetchFriends();
        setSyncing(false);
        setTimeout(() => setSyncMessage(""), 2500); // clear after 2.5s
      })
      .catch(() => {
        setSyncMessage("Failed to sync friends from Steam.");
        setSyncing(false);
        setTimeout(() => setSyncMessage(""), 2500); // clear after 2.5s
      });
  };

  if (loading) return <div>Loading friends...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>My Friends</h2>
      <button onClick={handleSync} disabled={syncing} style={{ marginBottom: 16 }}>
        {syncing ? "Syncing..." : "Sync Friends"}
      </button>
      {syncing && <div style={{ color: "#00ffe7", marginBottom: 8 }}>Syncing with Steam...</div>}
      {syncMessage && (
        <div style={{ color: syncMessage.includes("success") ? "green" : "red", marginBottom: 8 }}>
          {syncMessage}
        </div>
      )}
      <ul>
        {friends.map((friend) => (
          <li key={friend.steam_id}>
            <img
              src={friend.avatar_url}
              alt={friend.display_name || friend.steam_id}
              style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
            />
            <button
              style={{
                background: "none",
                border: "none",
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "1em"
              }}
              onClick={() => navigate(`/friends/${friend.steam_id}/games`, {
                state: { display_name: friend.display_name }
              })}
            >
              {friend.display_name || friend.steam_id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;