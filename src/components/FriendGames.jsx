import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import CommonGamesWithFriend from "./CommonGamesWithFriend";
import { apiFetch } from "../utils/api";
import "../Styles/Pages.css";

const FriendGames = () => {
  const { friendSteamId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [friendName, setFriendName] = useState(friendSteamId);
  const [sortOption, setSortOption] = useState("playtime");
  const [friends, setFriends] = useState([]);

  const mySteamId = localStorage.getItem("steam_id");

  // Fetch friend's display_name
  useEffect(() => {
    apiFetch(`/api/users/${friendSteamId}/summary_local`)
      .then((res) => res.json())
      .then((data) => setFriendName(data.display_name || friendSteamId))
      .catch(() => setFriendName(friendSteamId));
  }, [friendSteamId]);

  // Fetch friends list
  useEffect(() => {
    apiFetch(`/api/users/${mySteamId}/friends_cached`)
      .then((res) => res.json())
      .then((data) => setFriends(data.friends || data))
      .catch(() => setFriends([]));
  }, []);

  const fetchGames = () => {
    setLoading(true);
    apiFetch(`/api/users/${friendSteamId}/games`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch friend's games");
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
  }, [friendSteamId]);

  const handleSync = () => {
    setSyncing(true);
    apiFetch(`/api/users/${friendSteamId}/fetch_games`, { method: "POST" })
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

  const sortedGames = [...games].sort((a, b) => {
    if (sortOption === "playtime") {
      return b.playtime_minutes - a.playtime_minutes;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  if (loading) return <div className="page-root"><div className="page-card">Loading games...</div></div>;
  if (error) return <div className="page-root"><div className="page-card" style={{ color: "red" }}>{error}</div></div>;

  return (
    <div className="dashboard-root">
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card">
          <form
            className="mygames-header"
            onSubmit={e => {
              e.preventDefault();
              if (friendSteamId) navigate(`/friends/${friendSteamId}/games`);
            }}
          >
            <h2>Friend's Games</h2>
            <select
              value={friendSteamId}
              onChange={e => navigate(`/friends/${e.target.value}/games`)}
              style={{
                marginTop: 8,
                background: "#181c24",
                color: "#00ffe7",
                border: "1.5px solid #00ffe7",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: "1rem"
              }}
            >
              <option value="">Select a friend…</option>
              {friends.map(f => (
                <option key={f.steam_id} value={f.steam_id}>
                  {f.display_name || f.steam_id}
                </option>
              ))}
            </select>
          </form>
          <div className="mygames-header">
            <h2>{friendName}'s Games</h2>
            <button
              className="sync-btn-small"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? "Syncing..." : "Sync Games"}
            </button>
            <div style={{ marginTop: 8 }}>
              <label style={{ color: "#7fffd4", marginRight: 8 }}>Sort by:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={{
                  background: "#181c24",
                  color: "#00ffe7",
                  border: "1.5px solid #00ffe7",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: "1rem"
                }}
              >
                <option value="playtime">Playtime</option>
                <option value="alpha">Alphabetical</option>
              </select>
            </div>
          </div>
          {games.length === 0 ? (
            <div style={{ marginTop: "1em", color: "#555" }}>
              Oops! It looks like we don’t have this friend’s games in our system yet.
              <br />
              Please click <b>Sync Games</b> above to fetch their game library.
            </div>
          ) : (
            <ul>
              {sortedGames.map((game) => (
                <li key={game.appid} className="mygames-list-item">
                  {game.image_url && (
                    <img
                      src={game.image_url}
                      alt={game.name}
                      className="avatar"
                    />
                  )}
                  <div className="mygames-info">
                    <strong>{game.name}</strong>
                    <span className="mygames-playtime">
                      {formatPlaytime(game.playtime_minutes)} played
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: 24 }}>
            <CommonGamesWithFriend mySteamId={mySteamId} friendSteamId={friendSteamId} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FriendGames;