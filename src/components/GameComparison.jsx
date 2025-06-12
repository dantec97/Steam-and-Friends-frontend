import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { apiFetch } from "../utils/api";
import "../Styles/Pages.css";

const GameComparison = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const steamId = localStorage.getItem("steam_id");
  const [selectedFriend, setSelectedFriend] = useState("");
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allFriends, setAllFriends] = useState([]);
  const [friendDropdownOpen, setFriendDropdownOpen] = useState(false);

  // Fetch all friends for dropdown
  useEffect(() => {
    apiFetch(`/api/users/${steamId}/friends_cached`)
      .then(res => res.json())
      .then(data => setAllFriends(data.friends || data))
      .catch(() => setAllFriends([]));
  }, [steamId]);

  // Fetch comparison when friend is selected
  useEffect(() => {
    if (!selectedFriend) {
      setComparison(null);
      return;
    }
    setLoading(true);
    apiFetch(`/api/compare/${steamId}/${selectedFriend}`)
      .then(res => res.json())
      .then(data => {
        setComparison(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedFriend, steamId]);

  return (
    <div className="dashboard-root">
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card">
          <form
            className="mygames-header"
            onSubmit={e => e.preventDefault()}
          >
            <h2>Compare Games With a Friend</h2>
            <div
              className="custom-dropdown"
              tabIndex={0}
              style={{ position: "relative" }}
              onBlur={() => setFriendDropdownOpen(false)}
            >
              <button
                type="button"
                className="custom-dropdown-btn"
                onClick={() => setFriendDropdownOpen(o => !o)}
              >
                {allFriends.find(f => f.steam_id === selectedFriend)?.display_name || "Select a friend…"}
                <span style={{ marginLeft: 8, color: "#00ffe7" }}>▼</span>
              </button>
              {friendDropdownOpen && (
                <ul className="custom-dropdown-list">
                  {allFriends.map(f => (
                    <li
                      key={f.steam_id}
                      className={selectedFriend === f.steam_id ? "active" : ""}
                      onMouseDown={e => {
                        e.preventDefault();
                        setSelectedFriend(f.steam_id);
                        setFriendDropdownOpen(false);
                      }}
                    >
                      {f.display_name || f.steam_id}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
          {loading && <div style={{ marginTop: 24 }}>Loading...</div>}
          {!loading && comparison && (
            <>
              <h3 style={{ textAlign: "center", marginTop: 18 }}>Games You Both Own</h3>
              {comparison.length === 0 ? (
                <div style={{ textAlign: "center", color: "#888" }}>No games in common.</div>
              ) : (
                <ul>
                  {comparison.map(game => (
                    <li key={game.appid} className="mygames-list-item">
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="avatar"
                      />
                      <div className="mygames-info">
                        <strong>{game.name}</strong>
                        <span className="mygames-playtime">
                          You: {Math.round((game.user_playtime || 0) / 60)}h &nbsp;|&nbsp; Friend: {Math.round((game.friend_playtime || 0) / 60)}h
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {!loading && !selectedFriend && (
            <div style={{ textAlign: "center", color: "#888", marginTop: 24 }}>
              Select a friend to compare your games!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GameComparison;