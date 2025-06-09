import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LavaLampBackground from "./LavaLampBackground";
import "../Styles/dashboard.css";
import { apiFetch } from "../utils/api";

const Dashboard = () => {
  const steamId = localStorage.getItem("steam_id");
  const displayName = localStorage.getItem("account_display_name") || "Player";
  const avatarUrl = localStorage.getItem("avatar_url") || "/Logo.jpeg";
  const navigate = useNavigate();

  // State for dashboard data
  const [games, setGames] = useState([]);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    if (!steamId) return;
    setLoading(true);
    Promise.all([
      apiFetch(`/api/users/${steamId}/games`).then(res => res.json()).catch(() => []),
      apiFetch(`/api/users/${steamId}/friends_cached`).then(res => res.json()).catch(() => []),
      apiFetch(`/api/users/${steamId}/groups`).then(res => res.json()).catch(() => []),
    ]).then(([gamesData, friendsData, groupsData]) => {
      setGames(gamesData.games || gamesData || []);
      setFriends(friendsData.friends || friendsData || []);
      setGroups(groupsData || []);
      // Fake recent activity for now, you can replace with real events if you track them
      setRecentActivity([
        ...(groupsData.length
          ? groupsData.slice(0, 2).map(g => ({
              type: "group",
              text: `Group "${g.name}" synced recently`,
            }))
          : []),
        ...(friendsData.friends || friendsData || []).slice(0, 1).map(f => ({
          type: "friend",
          text: `${f.display_name || f.steam_id} played a new game`,
        })),
      ]);
      setLoading(false);
    });
  }, [steamId]);

  // Top played games
  const topGames = games
    .slice()
    .sort((a, b) => (b.playtime_minutes || 0) - (a.playtime_minutes || 0))
    .slice(0, 3);

  // Most active friend (by who has the most games in common)
  const mostActiveFriend =
    friends.length > 0 ? friends[0] : null;

  // Largest group (by member count)
  const largestGroup =
    groups.length > 0
      ? groups.reduce((a, b) => (a.member_count > b.member_count ? a : b), groups[0])
      : null;

  if (loading) return <div className="dashboard-main">Loading dashboard...</div>;

  return (
    <div className="dashboard-root">
      <LavaLampBackground />
      <aside className="dashboard-sidebar">
        <div className="dashboard-profile">
          <img src={avatarUrl} alt="Avatar" />
          <div>
            <div className="dashboard-name">{displayName}</div>
            <div className="dashboard-steamid">{steamId}</div>
          </div>
        </div>
        <nav>
          <ul>
            <li><Link to="/my_games">My Games</Link></li>
            <li><Link to="/friends">Friends</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to={`/friends/${steamId}/games`}>Friend's Games</Link></li>
            <li><Link to="/games/1/comparison">Game Comparison</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-cards dashboard-cards-grid">
          {/* Large My Games Card */}
          <div className="dashboard-card dashboard-card-large highlight">
            <h3>My Top Games</h3>
            <ul>
              {topGames.map(game => (
                <li key={game.appid} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <img src={game.image_url} alt={game.name} style={{ width: 32, height: 32, borderRadius: 6, marginRight: 10 }} />
                  <span style={{ fontWeight: 500 }}>{game.name}</span>
                  <span style={{ marginLeft: "auto", color: "#7fffd4" }}>
                    {Math.round((game.playtime_minutes || 0) / 60)}h played
                  </span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/my_games")}>View All Games</button>
          </div>

          {/* Friends Card */}
          <div className="dashboard-card">
            <h3>Friends</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {friends.slice(0, 5).map(friend => (
                <div key={friend.steam_id} style={{ textAlign: "center" }}>
                  <img
                    src={friend.avatar_url}
                    alt={friend.display_name}
                    style={{ width: 32, height: 32, borderRadius: "50%" }}
                  />
                  <div style={{ fontSize: 12 }}>{friend.display_name || friend.steam_id}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/friends")}>View All Friends</button>
          </div>

          {/* Groups Card */}
          <div className="dashboard-card">
            <h3>Groups</h3>
            <ul>
              {groups.slice(0, 3).map(group => (
                <li key={group.group_id} style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={group.picture_url || "/Logo.jpeg"}
                    alt={group.name}
                    style={{ width: 24, height: 24, borderRadius: 6, marginRight: 8 }}
                  />
                  <span>{group.name}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/groups")}>View All Groups</button>
          </div>

          {/* Recent Activity Card */}
          <div className="dashboard-card">
            <h3>Recent Activity</h3>
            <ul>
              {recentActivity.length === 0 && <li>No recent activity.</li>}
              {recentActivity.map((act, idx) => (
                <li key={idx}>{act.text}</li>
              ))}
            </ul>
          </div>

          {/* Game Comparison Card */}
          <div className="dashboard-card">
            <h3>Compare Games</h3>
            <p>See which games you and your friends or group have in common.</p>
            <button onClick={() => navigate("/games/1/comparison")}>Compare Now</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;