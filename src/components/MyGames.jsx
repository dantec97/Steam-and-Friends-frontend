import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const MyGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const steamId = localStorage.getItem("steam_id");
  const navigate = useNavigate();

  const fetchGames = () => {
    setLoading(true);
    apiFetch(`/api/users/${steamId}/games`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch games");
        return res.json();
      })
      .then((data) => {
        setGames(data.games || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGames();
  }, [steamId]);

  const handleSync = () => {
    setSyncing(true);
    apiFetch(`/api/users/${steamId}/fetch_games`, { method: "POST" })
      .then((res) => res.json())
      .then(() => {
        fetchGames();
        setSyncing(false);
      })
      .catch(() => setSyncing(false));
  };

  function formatPlaytime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  if (loading) return <div>Loading games...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>My Games</h2>
      <button onClick={handleSync} disabled={syncing}>
        {syncing ? "Syncing..." : "Sync Games"}
      </button>
      <ul>
        {games.map((game) => (
          <li key={game.appid}>
            <img
              src={game.image_url}
              alt={game.name}
              style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
            />
            <strong>{game.name}</strong> — {formatPlaytime(game.playtime_minutes)} played
            <button
              style={{ marginLeft: 8 }}
              onClick={() => navigate(`/games/${game.id}/comparison`)}
            >
              Compare with Friends
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyGames;