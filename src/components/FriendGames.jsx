import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonGamesWithFriend from "./CommonGamesWithFriend";
import { apiFetch } from "../utils/api";

const FriendGames = () => {
  const { friendSteamId } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [friendName, setFriendName] = useState(friendSteamId);
  const [sortOption, setSortOption] = useState("playtime");

  const mySteamId = localStorage.getItem("steam_id");

  // Fetch friend's display_name
  useEffect(() => {
    apiFetch(`/api/users/${friendSteamId}/summary_local`)
      .then((res) => res.json())
      .then((data) => setFriendName(data.display_name || friendSteamId))
      .catch(() => setFriendName(friendSteamId));
  }, [friendSteamId]);

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

  if (loading) return <div>Loading games...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Games for {friendName}</h2>
      <button onClick={handleSync} disabled={syncing}>
        {syncing ? "Syncing..." : "Sync Games"}
      </button>
      <div>
        <label>Sort by: </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="playtime">Playtime</option>
          <option value="alpha">Alphabetical</option>
        </select>
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
            <li key={game.appid} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              {game.image_url && (
                <img
                  src={game.image_url}
                  alt={game.name}
                  style={{ width: 32, height: 32, borderRadius: 4, marginRight: 10 }}
                />
              )}
              <strong>{game.name}</strong>
              {" — "}
              {formatPlaytime(game.playtime_minutes)} played
            </li>
          ))}
        </ul>
      )}
      <div>
      
      <CommonGamesWithFriend mySteamId={mySteamId} friendSteamId={friendSteamId} />
      </div>
    </div>
  );
};

export default FriendGames;