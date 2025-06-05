import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

const CommonGamesWithFriend = ({ mySteamId, friendSteamId }) => {
  const [commonGames, setCommonGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/compare/${mySteamId}/${friendSteamId}`)
      .then(res => res.json())
      .then(data => {
        setCommonGames(data);
        setLoading(false);
      });
  }, [mySteamId, friendSteamId]);

  if (loading) return <div>Loading common games...</div>;
  if (!commonGames.length) return <div>No games in common.</div>;

  function formatPlaytime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Games You Have in Common</h3>
      {commonGames.map(game => (
        <div key={game.appid} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
          {game.image_url && (
            <img
              src={game.image_url}
              alt={game.name}
              style={{ width: 32, height: 32, borderRadius: 4, marginRight: 10 }}
            />
          )}
          <strong>{game.name}</strong>
          {" — You: "}
          {formatPlaytime(game.user_playtime || 0)}
          {" | Friend: "}
          {formatPlaytime(game.friend_playtime || 0)}
        </div>
      ))}
    </div>
  );
};

export default CommonGamesWithFriend;