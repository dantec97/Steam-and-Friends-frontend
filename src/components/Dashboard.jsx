import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LavaLampBackground from "./LavaLampBackground";
import "../Styles/dashboard.css";
import { apiFetch } from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"; // npm install recharts

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

  // After fetching groups, pick the largest group (or let user pick)
  const [groupSharedGames, setGroupSharedGames] = useState([]);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupIndex, setGroupIndex] = useState(0);
  const [selectedGameIdx, setSelectedGameIdx] = useState(0);
  const [groupMembers, setGroupMembers] = useState([]);
  const primaryGroup = groups.length > 0
    ? groups.reduce((a, b) => (a.member_count > b.member_count ? a : b), groups[0])
    : null;
  const currentGroup = groups.length > 0 ? groups[groupIndex] : null;

  // Fetch dashboard data
  useEffect(() => {
    if (!steamId) return;
    setLoading(true);
    Promise.all([
      apiFetch(`/api/users/${steamId}/games`).then(res => res.json()).catch(() => []),
      apiFetch(`/api/users/${steamId}/friends_cached`).then(res => res.json()).catch(() => []),
      apiFetch(`/api/users/${steamId}/groups`).then(res => res.json()).catch(() => []),
      // apiFetch(`/api/users/${steamId}/groups/${groupId}`).then(res => res.json()).catch(() => []),
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

  // Fetch shared games for the primary group
  useEffect(() => {
    if (!currentGroup) return;
    setGroupLoading(true);
    // Fetch shared games
    apiFetch(`/api/groups/${currentGroup.group_id}/shared_games`)
      .then(res => res.json())
      .then(data => {
        setGroupSharedGames(Array.isArray(data) ? data : []);
        setGroupLoading(false);
      })
      .catch(() => setGroupLoading(false));
    // Fetch group members with display names
    apiFetch(`/api/groups/${currentGroup.group_id}/members`)
      .then(res => res.json())
      .then(data => setGroupMembers(Array.isArray(data) ? data : []))
      .catch(() => setGroupMembers([]));
  }, [currentGroup]);

  // Top played games
  const topGames = games
    .slice()
    .sort((a, b) => (b.playtime_minutes || 0) - (a.playtime_minutes || 0))
    .slice(0, 3);

  // Top 5 games for chart
  const topGamesForChart = games
    .slice()
    .sort((a, b) => (b.playtime_minutes || 0) - (a.playtime_minutes || 0))
    .slice(0, 5)
    .map(g => ({
      name: g.name.length > 12 ? g.name.slice(0, 12) + "…" : g.name,
      hours: Math.round((g.playtime_minutes || 0) / 60),
    }));

  // Most active friend (by who has the most games in common)
  const mostActiveFriend =
    friends.length > 0 ? friends[0] : null;

  // Largest group (by member count)
  const largestGroup =
    groups.length > 0
      ? groups.reduce((a, b) => (a.member_count > b.member_count ? a : b), groups[0])
      : null;

  // Friends' top games
  const friendsTopGames = friends
    .map(friend => {
      const fg = (friend.games || []).slice().sort((a, b) => (b.playtime_minutes || 0) - (a.playtime_minutes || 0))[0];
      return fg
        ? {
            steam_id: friend.steam_id,
            display_name: friend.display_name,
            avatar_url: friend.avatar_url,
            top_game: fg.name,
            top_game_hours: Math.round((fg.playtime_minutes || 0) / 60),
            top_game_img: fg.image_url,
          }
        : null;
    })
    .filter(Boolean)
    .slice(0, 5);

  // Online friends count (if you have status info)
  const onlineFriends = friends.filter(f => f.personastate === 1);

  // When groups change (e.g., after fetch), reset index if needed
  useEffect(() => {
    if (groupIndex >= groups.length) setGroupIndex(0);
  }, [groups]);

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

          {/* Playtime Graph Card */}
          <div className="dashboard-card dashboard-card-graph">
            <h3>Top 5 Games by Playtime</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={topGamesForChart}>
                <XAxis dataKey="name" stroke="#7fffd4" />
                <YAxis stroke="#7fffd4" />
                <Tooltip />
                <Bar dataKey="hours" fill="#00ffe7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Friends' Top Games Card */}
          <div className="dashboard-card dashboard-card-friends-top">
            <h3>Friends’ Top Games</h3>
            <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
              {friendsTopGames.map(friend => (
                <div key={friend.steam_id} style={{ minWidth: 120, textAlign: "center" }}>
                  <img src={friend.avatar_url} alt={friend.display_name} style={{ width: 36, borderRadius: "50%" }} />
                  <div style={{ fontSize: 13, margin: "4px 0" }}>{friend.display_name}</div>
                  <img src={friend.top_game_img} alt={friend.top_game} style={{ width: 32, borderRadius: 6 }} />
                  <div style={{ fontSize: 12 }}>{friend.top_game}</div>
                  <div style={{ color: "#7fffd4", fontSize: 12 }}>{friend.top_game_hours}h</div>
                </div>
              ))}
            </div>
          </div>

          {/* Online Friends Counter */}
          <div className="dashboard-card">
            <h3>Friends Online</h3>
            <div style={{ fontSize: 32, color: "#00ffe7", fontWeight: "bold" }}>
              {onlineFriends.length}
            </div>
            <div style={{ fontSize: 14, color: "#7fffd4" }}>out of {friends.length} friends</div>
          </div>

          {/* Large Top Group Games Card */}
          <div className="dashboard-card dashboard-card-large highlight">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                className="arrow-btn"
                onClick={() => setGroupIndex((groupIndex - 1 + groups.length) % groups.length)}
                disabled={groups.length <= 1}
                aria-label="Previous group"
              >
                &#8592;
              </button>
              <h3 style={{ flex: 1, textAlign: "center" }}>
                Top Common Games in&nbsp;
                <span style={{ color: "#00ffe7" }}>
                  {currentGroup ? currentGroup.name : "Your Group"}
                </span>
              </h3>
              <button
                className="arrow-btn"
                onClick={() => setGroupIndex((groupIndex + 1) % groups.length)}
                disabled={groups.length <= 1}
                aria-label="Next group"
              >
                &#8594;
              </button>
            </div>
            {groupLoading ? (
              <div>Loading group games...</div>
            ) : groupSharedGames.length === 0 ? (
              <div>No common games found for this group.</div>
            ) : (
              <div style={{ display: "flex", gap: 24 }}>
                {/* Left: List of top common games */}
                <ul style={{ flex: 2, margin: 0, padding: 0 }}>
                  {groupSharedGames.slice(0, 5).map((game, idx) => (
                    <li
                      key={game.appid}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 10,
                        background: idx === selectedGameIdx ? "#23283aee" : "transparent",
                        borderRadius: 8,
                        cursor: "pointer",
                        border: idx === selectedGameIdx ? "2px solid #00ffe7" : "none",
                        transition: "background 0.2s, border 0.2s"
                      }}
                      onClick={() => setSelectedGameIdx(idx)}
                    >
                      <img src={game.image_url} alt={game.name} style={{ width: 36, height: 36, borderRadius: 6, marginRight: 12 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{game.name}</div>
                        <div style={{ fontSize: 13, color: "#7fffd4" }}>
                          Total: {Math.round(game.total_playtime / 60)}h
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* Right: Members and their playtime for the selected game */}
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontWeight: 500, marginBottom: 8, color: "#00ffe7" }}>Members</div>
                  {groupSharedGames[selectedGameIdx] && Object.entries(groupSharedGames[selectedGameIdx].playtimes).map(([steam_id, minutes]) => {
                    // Find the member in the fetched groupMembers array
                    const member = groupMembers.find(m => m.steam_id === steam_id);
                    return (
                      <div key={steam_id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                        <img
                          src={member?.avatar_url || "/Logo.jpeg"}
                          alt={member?.display_name || steam_id}
                          style={{ width: 28, height: 28, borderRadius: "50%", marginRight: 8, border: "2px solid #00ffe7" }}
                        />
                        <span style={{ flex: 1 }}>{member?.display_name || steam_id}</span>
                        <span style={{ color: "#7fffd4", fontWeight: 500 }}>
                          {Math.round(minutes / 60)}h
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <button onClick={() => navigate(`/groups/${currentGroup?.group_id || ""}`)}>
              View Group Details
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;