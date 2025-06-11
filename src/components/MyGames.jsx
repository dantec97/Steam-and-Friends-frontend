import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "../Styles/Pages.css";
import SidebarNav from "./SidebarNav";

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

  if (loading) return <div className="page-root"><div className="page-card">Loading games...</div></div>;
  if (error) return <div className="page-root"><div className="page-card" style={{ color: "red" }}>{error}</div></div>;

  return (
    <div className="dashboard-root">
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card">
          <div className="mygames-header">
            <h2>My Games</h2>
            <button
              className="sync-btn-small"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync Games"}
            </button>
          </div>
          <ul>
            {games.map((game) => (
              <li key={game.appid} className="mygames-list-item">
                <img
                  src={game.image_url}
                  alt={game.name}
                  className="avatar"
                />
                <div className="mygames-info">
                  <strong>{game.name}</strong>
                  <span className="mygames-playtime">
                    {formatPlaytime(game.playtime_minutes)} played
                  </span>
                </div>
                <button
                  className="compare-btn"
                  onClick={() => navigate(`/games/${game.id}/comparison`)}
                >
                  Compare with Friends
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default MyGames;