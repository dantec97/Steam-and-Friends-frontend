import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LavaLampBackground from "./LavaLampBackground";
import "../Styles/dashboard.css";
import { apiFetch } from "../utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"; // npm install recharts
import SidebarNav from "./SidebarNav";

function PlaytimeGauge({ value, max = 1000, animate = true }) {
  const percent = Math.min(value / max, 1);
  const r = 60;
  const arcLen = Math.PI * r; // Full semicircle length
  const dashOffset = arcLen * (1 - percent);

  return (
    <svg width="140" height="80" viewBox="0 0 140 80">
      {/* Background arc */}
      <path
        d="M10,70 A60,60 0 0,1 130,70"
        fill="none"
        stroke="#23283a"
        strokeWidth="16"
      />
      {/* Foreground arc (always full, but revealed by dashoffset) */}
      <path
        className={animate ? "gauge-arc-animated" : ""}
        d="M10,70 A60,60 0 0,1 130,70"
        fill="none"
        stroke="#00ffe7"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={arcLen}
        strokeDashoffset={animate ? arcLen : dashOffset}
        style={{
          transition: "stroke-dashoffset 1.1s cubic-bezier(.4,2,.6,1)",
          strokeDashoffset: animate ? arcLen : dashOffset
        }}
      />
      {/* Needle */}
      
      {/* Center dot */}
      
      {/* Text */}
      
    </svg>
  );
}

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
  const [friendsTopGames, setFriendsTopGames] = useState([]);

  useEffect(() => {
    if (!steamId) return;
    apiFetch(`/api/users/${steamId}/friends_top_games`)
      .then(res => res.json())
      .then(data => setFriendsTopGames(data || []))
      .catch(() => setFriendsTopGames([]));
  }, [steamId]);

  // Online friends count (if you have status info)
  const onlineFriends = friends.filter(f => f.personastate === 1);

  // When groups change (e.g., after fetch), reset index if needed
  useEffect(() => {
    if (groupIndex >= groups.length) setGroupIndex(0);
  }, [groups]);

  // Animation state for bars
  const [animateBars, setAnimateBars] = useState(true);

  useEffect(() => {
    // Remove animation class after animation duration
    if (animateBars) {
      const timeout = setTimeout(() => setAnimateBars(false), 1000); // match your animation duration
      return () => clearTimeout(timeout);
    }
  }, [animateBars]);

  // Total playtime state
  const [totalPlaytime, setTotalPlaytime] = useState(0);

  useEffect(() => {
    if (!steamId) return;
    apiFetch(`/api/users/${steamId}/total_playtime`)
      .then(res => res.json())
      .then(data => setTotalPlaytime(Math.round((data.total_playtime_minutes || 0) / 60)))
      .catch(() => setTotalPlaytime(0));
  }, [steamId]);

  // Animation state for gauge
  const [animateGauge, setAnimateGauge] = useState(true);
  useEffect(() => {
    if (animateGauge) {
      const timeout = setTimeout(() => setAnimateGauge(false), 1100);
      return () => clearTimeout(timeout);
    }
  }, [animateGauge]);

  // New group state
  const [groupName, setGroupName] = useState("");
  const [groupCreateMsg, setGroupCreateMsg] = useState("");
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupCreateStep, setGroupCreateStep] = useState("name");
  const [newGroupId, setNewGroupId] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupPicUrl, setGroupPicUrl] = useState("");
  const [groupPicMsg, setGroupPicMsg] = useState("");

  // Handle group creation
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setGroupCreateMsg("");
    const res = await apiFetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName, owner_steam_id: steamId }),
    });
    const data = await res.json();
    if (res.ok) {
      setGroupCreateMsg(`Group "${data.name}" created!`);
      setNewGroupId(data.group_id);
      setGroupCreateStep("members");
      setGroupName("");
      apiFetch(`/api/users/${steamId}/groups`)
        .then(res => res.json())
        .then(data => setGroups(data || []));
    } else {
      setGroupCreateMsg(data.error || "Failed to create group");
    }
  };

  const handleAddMembers = async () => {
    if (!newGroupId || selectedMembers.length === 0) return;
    await apiFetch(`/api/groups/${newGroupId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam_ids: selectedMembers }),
    });
    setGroupCreateStep("picture");
  };

  const handleSetGroupPic = async (e) => {
    e.preventDefault();
    setGroupPicMsg("");
    if (!newGroupId || !groupPicUrl) return;
    const res = await apiFetch(`/api/groups/${newGroupId}/picture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ picture_url: groupPicUrl }),
    });
    if (res.ok) {
      setGroupPicMsg("Picture updated!");
      setGroupPicUrl("");
      setShowGroupForm(false);
      setGroupCreateStep("name");
      setSelectedMembers([]);
      setNewGroupId(null);
      setGroupPicMsg("");
      // Optionally refresh groups
      apiFetch(`/api/users/${steamId}/groups`)
        .then(res => res.json())
        .then(data => setGroups(data || []));
    } else {
      setGroupPicMsg("Failed to update picture.");
    }
  };

  const [groupSort, setGroupSort] = useState("size"); // default sort method
  const sortOptions = [
    { value: "size", label: "By Size" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "alpha", label: "A-Z" }
  ];
  const [sortOpen, setSortOpen] = useState(false);

  // Group sorting function
  function getSortedGroups(groups, method) {
    if (!Array.isArray(groups)) return [];
    switch (method) {
      case "size":
        return [...groups].sort((a, b) => (b.member_count || 0) - (a.member_count || 0));
      case "newest":
        return [...groups].sort((a, b) => (b.group_id || 0) - (a.group_id || 0)); // assumes higher id = newer
      case "oldest":
        return [...groups].sort((a, b) => (a.group_id || 0) - (b.group_id || 0));
      case "alpha":
        return [...groups].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      default:
        return groups;
    }
  }

  // Compare games state
  const [selectedFriend, setSelectedFriend] = useState("");
  const [compareGames, setCompareGames] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareAttempted, setCompareAttempted] = useState(false);
  const [compareDropdownOpen, setCompareDropdownOpen] = useState(false);

  const handleCompare = () => {
    if (!selectedFriend) return;
    setCompareAttempted(true);
    setCompareLoading(true);
    apiFetch(`/api/compare/${steamId}/${selectedFriend}`)
      .then(res => res.json())
      .then(data => {
        setCompareGames(data || []);
        setCompareLoading(false);
      })
      .catch(() => setCompareLoading(false));
  };

  if (loading) return <div className="dashboard-main">Loading dashboard...</div>;

  return (
    <div className="dashboard-root">
      <LavaLampBackground />
      <SidebarNav />
      <main className="dashboard-main">
        <div className="dashboard-center-wrap">
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
            <div className="dashboard-card dashboard-card-friends">
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
            <div className="dashboard-card dashboard-card-groups">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3>Groups</h3>
                {!showGroupForm && (
                  <button
                    aria-label="Create Group"
                    style={{
                      background: "#00ffe7",
                      color: "#181c24",
                      border: "none",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      fontSize: 20,
                      fontWeight: "bold",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 8
                    }}
                    onClick={() => {
                      setShowGroupForm(true);
                      setGroupCreateStep("name");
                      setGroupCreateMsg("");
                      setSelectedMembers([]);
                      setGroupPicUrl("");
                      setGroupPicMsg("");
                    }}
                  >+</button>
                )}
                {showGroupForm && (
                  <button
                    aria-label="Cancel"
                    style={{ background: "none", color: "#888", border: "none", fontSize: 18, cursor: "pointer", marginLeft: 8 }}
                    onClick={() => {
                      setShowGroupForm(false);
                      setGroupCreateStep("name");
                      setSelectedMembers([]);
                      setNewGroupId(null);
                      setGroupPicUrl("");
                      setGroupPicMsg("");
                    }}
                  >✕</button>
                )}
              </div>
              {showGroupForm && groupCreateStep === "name" && (
                <form onSubmit={handleCreateGroup} style={{ marginBottom: 12, marginTop: 8, display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="New Group Name"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    required
                    style={{ marginRight: 8, padding: "4px 8px", borderRadius: 4, border: "1px solid #333" }}
                    autoFocus
                  />
                  <button type="submit" style={{ marginRight: 8 }}>Create</button>
                </form>
              )}
              {showGroupForm && groupCreateStep === "members" && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ marginBottom: 8 }}>Select Members:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {friends.map(friend => (
                      <button
                        key={friend.steam_id}
                        type="button"
                        style={{
                          background: selectedMembers.includes(friend.steam_id) ? "#00ffe7" : "#23283a",
                          color: selectedMembers.includes(friend.steam_id) ? "#181c24" : "#7fffd4",
                          border: "1px solid #00ffe7",
                          borderRadius: 6,
                          padding: "4px 8px",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setSelectedMembers(members =>
                            members.includes(friend.steam_id)
                              ? members.filter(id => id !== friend.steam_id)
                              : [...members, friend.steam_id]
                          );
                        }}
                      >
                        {friend.display_name || friend.steam_id}
                      </button>
                    ))}
                  </div>
                  <button
                    style={{ marginTop: 12 }}
                    onClick={handleAddMembers}
                    disabled={selectedMembers.length === 0}
                  >
                    Add Members
                  </button>
                </div>
              )}
              {showGroupForm && groupCreateStep === "picture" && (
                <form onSubmit={handleSetGroupPic} style={{ marginBottom: 12, marginTop: 8, display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder="Group Picture URL"
                    value={groupPicUrl}
                    onChange={e => setGroupPicUrl(e.target.value)}
                    style={{ marginRight: 8, padding: "4px 8px", borderRadius: 4, border: "1px solid #333" }}
                    autoFocus
                  />
                  <button type="submit" style={{ marginRight: 8 }}>Set Picture</button>
                  {groupPicMsg && <span style={{ color: "#7fffd4", marginLeft: 8 }}>{groupPicMsg}</span>}
                </form>
              )}
              {groupCreateMsg && <div style={{ color: "#7fffd4", marginBottom: 8 }}>{groupCreateMsg}</div>}
              <div className="dashboard-group-sort-wrap" style={{ marginBottom: 10 }}>
                <label htmlFor="group-sort" style={{ marginRight: 8, color: "#7fffd4" }}>Sort:</label>
                <div
                  className="custom-dropdown"
                  tabIndex={0}
                  onBlur={() => setSortOpen(false)}
                  style={{ display: "inline-block", position: "relative", minWidth: 120 }}
                >
                  <button
                    type="button"
                    className="custom-dropdown-btn"
                    onClick={() => setSortOpen(o => !o)}
                  >
                    {sortOptions.find(o => o.value === groupSort)?.label}
                    <span style={{ marginLeft: 8, color: "#00ffe7" }}>▼</span>
                  </button>
                  {sortOpen && (
                    <ul className="custom-dropdown-list">
                      {sortOptions.map(opt => (
                        <li
                          key={opt.value}
                          className={groupSort === opt.value ? "active" : ""}
                          onMouseDown={e => {
                            e.preventDefault();
                            setGroupSort(opt.value);
                            setSortOpen(false);
                          }}
                        >
                          {opt.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <ul>
                {getSortedGroups(groups, groupSort).slice(0, 3).map(group => (
                  <li key={group.group_id} style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={group.picture_url || "/Logo.jpeg"}
                      alt={group.name}
                      style={{ width: 24, height: 24, borderRadius: 6, marginRight: 8 }}
                    />
                    <span>{group.name}</span>
                    <span style={{ marginLeft: "auto", color: "#7fffd4", fontSize: 12 }}>
                      {group.member_count ? `${group.member_count} members` : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate("/groups")}>View All Groups</button>
            </div>

            {/* Recent Activity Card */}
            {/* <div className="dashboard-card dashboard-card-recent"> */}
            <div className="sizefix dashboard-card dashboard-card-compare dashboard-card-small">
              <h3>Recent Activity</h3>
              <ul>
                {recentActivity.length === 0 && <li>No recent activity.</li>}
                {recentActivity.map((act, idx) => (
                  <li key={idx}>{act.text}</li>
                ))}
              </ul>
            </div>

            {/* Game Comparison Card */}
            <div className="sizefix dashboard-card dashboard-card-compare dashboard-card-small">
              <h3>Compare Games</h3>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  className="custom-dropdown"
                  tabIndex={0}
                  style={{ position: "relative", flex: 1, marginBottom: 8, minWidth: 180 }}
                  onBlur={() => setCompareDropdownOpen(false)}
                >
                  <button
                    type="button"
                    className="custom-dropdown-btn"
                    onClick={() => setCompareDropdownOpen(o => !o)}
                  >
                    {friends.find(f => f.steam_id === selectedFriend)?.display_name || "Select a friend…"}
                    <span style={{ marginLeft: 8, color: "#00ffe7" }}>▼</span>
                  </button>
                  {compareDropdownOpen && (
                    <ul className="custom-dropdown-list">
                      {friends.map(f => (
                        <li
                          key={f.steam_id}
                          className={selectedFriend === f.steam_id ? "active" : ""}
                          onMouseDown={e => {
                            e.preventDefault();
                            setSelectedFriend(f.steam_id);
                            setCompareDropdownOpen(false);
                          }}
                        >
                          {f.display_name || f.steam_id}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={handleCompare}
                  disabled={!selectedFriend || compareLoading}
                  style={{ marginLeft: 8 }}
                >
                  {compareLoading ? "Comparing..." : "Compare"}
                </button>
              </div>
              {compareGames.length > 0 && (
                <div style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  marginTop: 12,
                  marginBottom: 8,
                  paddingRight: 4
                }}>
                  <ul style={{ margin: 0, padding: 0 }}>
                    {compareGames.slice(0, 8).map(game => (
                      <li key={game.appid} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                        <img src={game.image_url} alt={game.name} style={{ width: 28, height: 28, borderRadius: 6, marginRight: 8 }} />
                        <span style={{ flex: 1 }}>{game.name}</span>
                        <span style={{ color: "#7fffd4", marginLeft: 8 }}>
                          You: {Math.round(game.user_playtime / 60)}h / Friend: {Math.round(game.friend_playtime / 60)}h
                        </span>
                      </li>
                    ))}
                  </ul>
                  {compareGames.length > 8 && (
                    <button
                      style={{
                        display: "block",
                        margin: "8px auto 0 auto",
                        background: "#23283a",
                        color: "#00ffe7",
                        border: "none",
                        borderRadius: 6,
                        padding: "4px 12px",
                        cursor: "pointer"
                      }}
                      onClick={() => navigate(`/friends/${selectedFriend}/games`)}
                    >
                      View All
                    </button>
                  )}
                </div>
              )}
              {compareAttempted && compareGames.length === 0 && selectedFriend && !compareLoading && (
                <div style={{ color: "#888", marginTop: 12 }}>No games in common.</div>
              )}
              <p style={{ marginTop: 10, color: "#aaa" }}>
                See which games you and your friends have in common!
              </p>
            </div>

            {/* Playtime Graph Card */}
            <div className={`dashboard-card dashboard-card-graph${animateBars ? " animate-bars" : ""}`}>
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
                {friendsTopGames
                  .filter(game => game.appid !== 431960) // Exclude Wallpaper Engine
                  .slice(0, 3) // Only top 3
                  .length === 0 ? (
                  <div style={{ color: "#888" }}>No data yet. Sync your friends' games!</div>
                ) : (
                  friendsTopGames
                    .filter(game => game.appid !== 431960)
                    .slice(0, 2)
                    .map(game => (
                      <div key={game.appid} style={{ minWidth: 120, textAlign: "center" }}>
                        <img src={game.image_url} alt={game.name} style={{ width: 36, borderRadius: 6 }} />
                        <div style={{ fontSize: 13, margin: "4px 0" }}>{game.name}</div>
                        <div style={{ color: "#7fffd4", fontSize: 12 }}>
                          {Math.round((game.total_playtime || 0) / 60)}h total
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Total Playtime Gauge Card */}
            <div className="dashboard-card dashboard-card-gauge">
              <div className="total-playtime-inner">
                <h3>Total Playtime</h3>
                <PlaytimeGauge value={totalPlaytime} max={1000} animate={animateGauge} />
              
                <div className="total-playtime-label">
                  {totalPlaytime.toLocaleString()} hours played
                </div>
              </div>
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
                        <div className="group-member-PT" key={steam_id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;