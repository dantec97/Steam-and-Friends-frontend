import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { apiFetch } from "../utils/api";
import "../Styles/Pages.css";

const DEFAULT_GROUP_PIC = "/Logo.jpeg";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pictureUrl, setPictureUrl] = useState("");
  const [group, setGroup] = useState({});
  const [picMsg, setPicMsg] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [delMsg, setDelMsg] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState("");
  const [comparisonGames, setComparisonGames] = useState([]);
  const steamId = localStorage.getItem("steam_id");

  // Fetch group info, members, and user's friends
  useEffect(() => {
    apiFetch(`/api/groups/${groupId}/members`)
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      });
    apiFetch(`/api/groups/${groupId}`)
      .then(res => res.json())
      .then(data => setGroup(data));
    if (steamId) {
      apiFetch(`/api/users/${steamId}/friends_cached`)
        .then(res => res.json())
        .then(data => setFriends(data.friends || data))
        .catch(() => setFriends([]));
    }
  }, [groupId, addMsg, delMsg, steamId]);

  useEffect(() => {
    if (members.length === 0) return;
    setComparisonLoading(true);
    setComparisonError("");
    apiFetch(`/api/groups/${groupId}/shared_games`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComparisonGames(data);
        else setComparisonError(data.error || "Failed to fetch common games.");
        setComparisonLoading(false);
      })
      .catch(() => {
        setComparisonError("Network error.");
        setComparisonLoading(false);
      });
  }, [groupId, members]);

  // Update filteredFriends when friendSearch, friends, or members change
  useEffect(() => {
    if (!friendSearch) {
      setFilteredFriends([]);
      return;
    }
    const lower = friendSearch.toLowerCase();
    setFilteredFriends(
      friends
        .filter(
          f =>
            !members.some(m => m.steam_id === f.steam_id) &&
            (f.display_name || f.steam_id).toLowerCase().includes(lower)
        )
        .slice(0, 8)
    );
  }, [friendSearch, friends, members]);

  // Show all friends not in group if search is empty, else filter
  useEffect(() => {
    const lower = friendSearch.toLowerCase();
    setFilteredFriends(
      friends
        .filter(
          f =>
            !members.some(m => m.steam_id === f.steam_id) &&
            (
              !friendSearch ||
              (f.display_name || f.steam_id).toLowerCase().includes(lower)
            )
        )
        .slice(0, 4) // <-- Limit to 4
    );
  }, [friendSearch, friends, members]);

  const handlePictureChange = async (e) => {
    e.preventDefault();
    setPicMsg("");
    const res = await apiFetch(`/api/groups/${groupId}/picture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ picture_url: pictureUrl }),
      Authorization: `Bearer ${localStorage.getItem("token")}`
    });
    if (res.ok) {
      setPicMsg("Group picture updated!");
      setPictureUrl("");
      apiFetch(`/api/groups/${groupId}`)
        .then(res => res.json())
        .then(data => setGroup(data));
    } else {
      setPicMsg("Failed to update picture.");
    }
  };

  const handleSyncGroup = async () => {
    setSyncing(true);
    setSyncMsg("");
    const steamIds = members.map(m => m.steam_id);
    const res = await apiFetch("/api/sync_group_games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam_ids: steamIds }),
    });
    const data = await res.json();
    setSyncing(false);
    setSyncMsg(data.synced ? "Group sync complete!" : (data.error || "Sync failed"));
  };

  const handleAddMemberDirect = async (steamIdToAdd) => {
    setAddMsg("");
    const res = await apiFetch(`/api/groups/${groupId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam_ids: [steamIdToAdd] }),
    });
    const data = await res.json();
    if (res.ok) {
      setAddMsg("Member added!");
      setFriendSearch("");
      setFilteredFriends([]);
    } else {
      setAddMsg(data.error || "Failed to add member.");
    }
  };

  const handleDeleteMember = async (steamIdToDelete) => {
    setDelMsg("");
    const res = await apiFetch(`/api/groups/${groupId}/members/${steamIdToDelete}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      setDelMsg("Member removed!");
    } else {
      setDelMsg(data.error || "Failed to remove member.");
    }
  };

  const handleCompareGroupGames = async () => {
    setComparisonLoading(true);
    setComparisonError("");
    setComparisonGames([]);
    try {
      const sharedRes = await apiFetch(`/api/groups/${groupId}/shared_games`);
      const sharedData = await sharedRes.json();
      if (sharedRes.ok && Array.isArray(sharedData)) {
        setComparisonGames(sharedData);
      } else {
        setComparisonError(sharedData.error || "Failed to fetch common games.");
      }
    } catch (err) {
      setComparisonError("Network error.");
    }
    setComparisonLoading(false);
  };

  if (loading) return <div className="page-root"><div className="page-card">Loading group members...</div></div>;

  // Find the owner's steam_id by matching group.owner_id to a member's user_id or steam_id
  const ownerMember = members.find(m => m.user_id === group.owner_id || m.steam_id === group.owner_steam_id);
  const ownerSteamId = ownerMember ? ownerMember.steam_id : null;

  return (
    <div className="dashboard-root">
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card">
          <div className="mygames-header" style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <img
                src={group.picture_url && group.picture_url.trim() !== "" ? group.picture_url : DEFAULT_GROUP_PIC}
                alt="Group"
                style={{ width: 64, borderRadius: 8, marginBottom: 0, boxShadow: "0 0 12px #00ffe7aa" }}
              />
              <h2 style={{ margin: 0 }}>{group.name || "Group"}</h2>
            </div>
            <form onSubmit={handlePictureChange} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="text"
                placeholder="New group picture URL"
                value={pictureUrl}
                onChange={e => setPictureUrl(e.target.value)}
                style={{ width: 220, fontSize: "1em" }}
              />
              <button type="submit" className="compare-btn" style={{ margin: 0, padding: "6px 14px" }}>Set Picture</button>
            </form>
            {picMsg && <div style={{ color: "#7fffd4", marginTop: 6 }}>{picMsg}</div>}
          </div>

          {/* Add Member Search */}
          <div className="mygames-header" style={{ marginBottom: 18 }}>
            <h3>Add Member</h3>
            <div
              className="custom-dropdown"
              tabIndex={0}
              style={{ position: "relative", minWidth: 260, width: 260 }}
              onBlur={() => setShowDropdown(false)}
            >
              <input
                type="text"
                className="custom-dropdown-btn"
                style={{ width: "100%" }}
                placeholder="Search for a friend to add..."
                value={friendSearch}
                onChange={e => {
                  setFriendSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                autoComplete="off"
              />
              {showDropdown && (
                <ul className="custom-dropdown-list" style={{ maxHeight: 320, overflowY: "auto" }}>
                  {filteredFriends.length === 0 && (
                    <li style={{ color: "#888" }}>No friends found</li>
                  )}
                  {filteredFriends.map(f => (
                    <li
                      key={f.steam_id}
                      onMouseDown={e => {
                        e.preventDefault();
                        handleAddMemberDirect(f.steam_id);
                        setShowDropdown(false);
                      }}
                    >
                      <img
                        src={f.avatar_url}
                        alt={f.display_name}
                        style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 10 }}
                      />
                      {f.display_name || f.steam_id}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {addMsg && <div style={{ color: "#7fffd4", marginTop: 6 }}>{addMsg}</div>}
          </div>

          {/* Members List */}
          <div className="mygames-header" style={{ marginBottom: 18 }}>
            <h3>Members</h3>
            <ul>
              {members.map(member => (
                <li key={member.steam_id} className="mygames-list-item" style={{ justifyContent: "flex-start" }}>
                  {member.avatar_url && (
                    <img
                      src={member.avatar_url}
                      alt={member.display_name}
                      style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                    />
                  )}
                  <strong>{member.display_name}</strong>
                  {member.steam_id === ownerSteamId && (
                    <span style={{ color: "#7fffd4", marginLeft: 8, fontSize: "0.98em" }}>(Owner)</span>
                  )}
                  {member.steam_id !== ownerSteamId && (
                    <button
                      className="compare-btn"
                      style={{ marginLeft: "auto", padding: "4px 12px", background: "#ff3b3b", color: "#fff" }}
                      onClick={() => handleDeleteMember(member.steam_id)}
                      title="Remove member"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {delMsg && <div style={{ color: "#ff3b3b", marginTop: 6 }}>{delMsg}</div>}
          </div>

          {/* Group Actions */}
          <div className="mygames-header" style={{ marginBottom: 18 }}>
            <button onClick={handleSyncGroup} disabled={syncing} className="sync-btn-small">
              {syncing ? "Syncing..." : "Sync Group Games from Steam"}
            </button>
            {syncMsg && <div style={{ color: "#7fffd4", marginTop: 8 }}>{syncMsg}</div>}
          </div>

          {/* Group Game Comparison */}
          <div className="mygames-header" style={{ marginBottom: 0 }}>
            <button onClick={handleCompareGroupGames} disabled={comparisonLoading} className="compare-btn">
              {comparisonLoading ? "Comparing..." : "Compare Group Games"}
            </button>
            {comparisonError && <div style={{ color: "red", marginTop: 10 }}>{comparisonError}</div>}
            {comparisonGames.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4>Common Games</h4>
                <div className="group-games-grid">
                  {comparisonGames.map(game => (
                    <div key={game.appid} className="group-game-card">
                      <div className="group-game-header">
                        <img src={game.image_url} alt={game.name} />
                        <div>
                          <div className="group-game-title">{game.name}</div>
                          <div className="group-game-total">
                            Total: {Math.round(game.total_playtime / 60)} hrs
                          </div>
                        </div>
                      </div>
                      <ul className="group-game-members">
                        {members.map(member => (
                          <li key={member.steam_id}>
                            <img src={member.avatar_url} alt={member.display_name} />
                            <span style={{ minWidth: 90 }}>{member.display_name}:</span>
                            <span style={{ color: "#7fffd4", marginLeft: 8 }}>
                              {Math.round((game.playtimes?.[member.steam_id] || 0) / 60)} hrs
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroupDetails;