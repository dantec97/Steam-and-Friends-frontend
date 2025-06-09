import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../utils/api";

const GameComparison = () => {
  const { gameId } = useParams();
  const steamId = localStorage.getItem("steam_id");
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/users/${steamId}/games/${gameId}/friends`)
      .then((res) => res.json())
      .then((data) => {
        setFriends(data);
        setLoading(false);
      });
  }, [steamId, gameId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Friends who play this game</h2>
      {friends.length === 0 ? (
        <div>No friends own this game.</div>
      ) : (
        <ul>
          {friends.map((friend) => (
            <li key={friend.steam_id}>
              <img
                src={friend.avatar_url}
                alt={friend.display_name}
                style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
              />
              <strong>{friend.display_name}</strong> — {friend.playtime_minutes} min played
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameComparison;