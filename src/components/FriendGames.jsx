import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FriendGames = () => {
  const { friendSteamId } = useParams();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [friendName, setFriendName] = useState(friendSteamId);

  // Fetch friend's display_name
  useEffect(() => {
    fetch(`/api/users/${friendSteamId}/summary_local`)
      .then((res) => res.json())
      .then((data) => setFriendName(data.display_name || friendSteamId))
      .catch(() => setFriendName(friendSteamId));
  }, [friendSteamId]);

  const fetchGames = () => {
    setLoading(true);
    fetch(`/api/users/${friendSteamId}/games`)
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
    fetch(`/api/users/${friendSteamId}/fetch_games`, { method: "POST" })
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
      <h2>Games for {friendName}</h2>
      <button onClick={handleSync} disabled={syncing}>
        {syncing ? "Syncing..." : "Sync Games"}
      </button>
      {games.length === 0 ? (
        <div style={{ marginTop: "1em", color: "#555" }}>
          Oops! It looks like we don’t have this friend’s games in our system yet.
          <br />
          Please click <b>Sync Games</b> above to fetch their game library.
        </div>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.appid}>
              <strong>{game.name}</strong>
              {" — "}
              {formatPlaytime(game.playtime_minutes)} played
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendGames;