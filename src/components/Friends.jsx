import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const steamId = localStorage.getItem("steam_id");
  const navigate = useNavigate();

 useEffect(() => {
  if (!steamId) {
    setError("No Steam ID found. Please log in.");
    setLoading(false);
    return;
  }
  fetch(`/api/users/${steamId}/friends_cached`)
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
}, [steamId]);

  if (loading) return <div>Loading friends...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>My Friends</h2>
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