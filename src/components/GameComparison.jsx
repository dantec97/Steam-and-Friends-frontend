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
  const [search, setSearch] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

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

  const filteredFriends = search
    ? allFriends.filter(f =>
        (f.display_name || f.steam_id)
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : allFriends;

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
                      className={selectedFriend === f.steam_id ? "active" : ""}
                      onMouseDown={e => {
                        e.preventDefault();
                        setSelectedFriend(f.steam_id);
                        setSearchDropdownOpen(false);
                        setSearch("");
                      }}
                    >
                      <img
                        src={f.avatar_url}
                        alt={f.display_name}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          marginRight: 8
                        }}
                      />
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