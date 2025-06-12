import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { apiFetch } from "../utils/api";
import "../Styles/Pages.css";

const FriendGames = () => {
  const { friendSteamId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [sortOption, setSortOption] = useState("playtime");
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const mySteamId = localStorage.getItem("steam_id");

  // Fetch friends list
  useEffect(() => {
    apiFetch(`/api/users/${mySteamId}/friends_cached`)
      .then((res) => res.json())
      .then((data) => setFriends(data.friends || data))
      .catch(() => setFriends([]));
  }, [mySteamId]);

  // Fetch friend's display_name and games only if a friend is selected
  useEffect(() => {
    if (!friendSteamId) {
      setFriendName("");
      setGames([]);
      setError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    apiFetch(`/api/users/${friendSteamId}/summary_local`)
      .then((res) => res.json())
      .then((data) => setFriendName(data.display_name || friendSteamId))
      .catch(() => setFriendName(friendSteamId));
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
  }, [friendSteamId]);

  const handleSync = () => {
    setSyncing(true);
    apiFetch(`/api/users/${friendSteamId}/fetch_games`, { method: "POST" })
      .then((res) => res.json())
      .then(() => {
        // re-fetch games
        apiFetch(`/api/users/${friendSteamId}/games`)
          .then((res) => res.json())
          .then((data) => setGames(data.games || data))
          .finally(() => setSyncing(false));
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

  // Filter friends for search
  const filteredFriends = search
    ? friends.filter(f =>
        (f.display_name || f.steam_id)
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : friends;

  // Only show the games UI if a friend is selected
  const showGames = !!friendSteamId;

  return (
    <div className="dashboard-root">
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card">
          <div className="mygames-header">
            <h2>Friend's Games</h2>
            {/* Friend Search/Select */}
            <div
              className="custom-dropdown"
              tabIndex={0}
              style={{ position: "relative", marginTop: 8, minWidth: 260 }}
              onBlur={() => setSearchDropdownOpen(false)}
            >
              <input
                type="text"
                className="custom-dropdown-btn"
                style={{ width: "100%" }}
                placeholder="Search for a friend..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onFocus={() => setSearchDropdownOpen(true)}
                autoComplete="off"
              />
              {searchDropdownOpen && (
                <ul className="custom-dropdown-list">
                  {filteredFriends.length === 0 && (
                    <li style={{ color: "#888" }}>No friends found</li>
                  )}
                  {filteredFriends.map(f => (
                    <li
                      key={f.steam_id}
                      className={friendSteamId === f.steam_id ? "active" : ""}
                      onMouseDown={e => {
                        e.preventDefault();
                        setSearchDropdownOpen(false);
                        setSearch("");
                        navigate(`/friends/${f.steam_id}/games`);
                      }}
                    >
                      <img
                        src={f.avatar_url}
                        alt={f.display_name}
                        style={{ width: 24, height: 24, borderRadius: "50%", marginRight: 8 }}
                      />
                      {f.display_name || f.steam_id}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Only show the rest if a friend is selected */}
          {showGames && (
            <>
              <div className="mygames-header">
                <h2>{friendName}'s Games</h2>
                <button
                  className="sync-btn-small"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing ? "Syncing..." : "Sync Games"}
                </button>
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <label style={{ color: "#7fffd4", marginRight: 8 }}>Sort by:</label>
                  <div
                    className="custom-dropdown"
                    tabIndex={0}
                    style={{ position: "relative", minWidth: 140 }}
                    onBlur={() => setSortDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      className="custom-dropdown-btn"
                      onClick={() => setSortDropdownOpen(o => !o)}
                    >
                      {sortOption === "playtime" ? "Playtime" : "Alphabetical"}
                      <span style={{ marginLeft: 8, color: "#00ffe7" }}>▼</span>
                    </button>
                    {sortDropdownOpen && (
                      <ul className="custom-dropdown-list">
                        <li
                          className={sortOption === "playtime" ? "active" : ""}
                          onMouseDown={e => {
                            e.preventDefault();
                            setSortOption("playtime");
                            setSortDropdownOpen(false);
                          }}
                        >
                          Playtime
                        </li>
                        <li
                          className={sortOption === "alpha" ? "active" : ""}
                          onMouseDown={e => {
                            e.preventDefault();
                            setSortOption("alpha");
                            setSortDropdownOpen(false);
                          }}
                        >
                          Alphabetical
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              {loading ? (
                <div style={{ marginTop: "1em", color: "#555" }}>Loading games...</div>
              ) : error ? (
                <div style={{ marginTop: "1em", color: "red" }}>{error}</div>
              ) : games.length === 0 ? (
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FriendGames;