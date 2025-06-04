import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const DEFAULT_GROUP_PIC = "/Logo.jpeg"; // Or any placeholder image

const GroupDetails = () => {
  const { groupId } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pictureUrl, setPictureUrl] = useState("");
  const [group, setGroup] = useState({});
  const [picMsg, setPicMsg] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [addSteamId, setAddSteamId] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [delMsg, setDelMsg] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState("");
  const [comparisonGames, setComparisonGames] = useState([]);
  const steamId = localStorage.getItem("steam_id");

  // Fetch group info, members, and user's friends
  useEffect(() => {
    fetch(`/api/groups/${groupId}/members`)
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setLoading(false);
      });
    fetch(`/api/groups/${groupId}`)
      .then(res => res.json())
      .then(data => {
        setGroup(data);
        // Do NOT setPictureUrl here, keep it empty unless user is editing
      });
    // Fetch user's friends
    if (steamId) {
      fetch(`/api/users/${steamId}/friends_cached`)
        .then(res => res.json())
        .then(data => setFriends(data))
        .catch(() => setFriends([]));
    }
  }, [groupId, addMsg, delMsg, steamId]);

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
            f.display_name.toLowerCase().includes(lower)
        )
        .slice(0, 5)
    );
  }, [friendSearch, friends, members]);

  const handlePictureChange = async (e) => {
    e.preventDefault();
    setPicMsg("");
    const res = await fetch(`/api/groups/${groupId}/picture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ picture_url: pictureUrl }),
    });
    if (res.ok) {
      setPicMsg("Group picture updated!");
      setPictureUrl(""); // Clear the input after successful update
      // Optionally, refresh group info to show new picture
      fetch(`/api/groups/${groupId}`)
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
    const res = await fetch("/api/sync_group_games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam_ids: steamIds }),
    });
    const data = await res.json();
    setSyncing(false);
    setSyncMsg(data.synced ? "Group sync complete!" : (data.error || "Sync failed"));
  };

  // Add member by Steam ID
  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddMsg("");
    if (!addSteamId) return;
    const res = await fetch(`/api/groups/${groupId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam_ids: [addSteamId] }),
    });
    const data = await res.json();
    if (res.ok) {
      setAddMsg("Member added!");
      setAddSteamId("");
    } else {
      setAddMsg(data.error || "Failed to add member.");
    }
  };

  const handleAddMemberDirect = async (steamIdToAdd) => {
    setAddMsg("");
    const res = await fetch(`/api/groups/${groupId}/members`, {
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

  // Delete member by Steam ID (prevent owner from deleting themselves)
  const handleDeleteMember = async (steamIdToDelete) => {
    setDelMsg("");
    const res = await fetch(`/api/groups/${groupId}/members/${steamIdToDelete}`, {
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
    const steamIds = members.map(m => m.steam_id);

    try {
      // 1. Sync group games
      const syncRes = await fetch("/api/sync_group_games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steam_ids: steamIds }),
      });
      await syncRes.json(); // ignore response, just ensure sync

      // 2. Fetch common games for this group
      const sharedRes = await fetch(`/api/groups/${groupId}/shared_games`);
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

  if (loading) return <div>Loading group members...</div>;

  // Find the owner's steam_id by matching group.owner_id to a member's user_id or steam_id
  const ownerMember = members.find(m => m.user_id === group.owner_id || m.steam_id === group.owner_steam_id);
  const ownerSteamId = ownerMember ? ownerMember.steam_id : null;

  return (
    <div>
      <h2>{group.name || "Group"} Members</h2>
      <img
        src={group.picture_url && group.picture_url.trim() !== "" ? group.picture_url : DEFAULT_GROUP_PIC}
        alt="Group"
        style={{ width: 100, borderRadius: 8, marginBottom: 16 }}
      />
      <form onSubmit={handlePictureChange} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="New group picture URL"
          value={pictureUrl}
          onChange={e => setPictureUrl(e.target.value)}
          style={{ width: 300 }}
        />
        <button type="submit">Set Group Picture</button>
      </form>
      {picMsg && <div>{picMsg}</div>}

      <form onSubmit={e => e.preventDefault()} style={{ marginBottom: 16, position: "relative" }}>
        <h6>Add Member by Name</h6>
        <input 
          type="text"
          placeholder="Type to search friends to add"
          value={friendSearch}
          onChange={e => {
            setFriendSearch(e.target.value);
            setShowDropdown(true);
          }}
          style={{ width: 240, marginRight: 8 }}
          autoComplete="off"
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // delay to allow click
        />
        <button
          type="button"
          style={{ marginLeft: 8 }}
          onClick={() => {
            setShowDropdown(!showDropdown);
            setFriendSearch(""); // show all friends when dropdown is toggled
          }}
        >
          {showDropdown ? "Hide List" : "Show All"}
        </button>
        {(showDropdown && (filteredFriends.length > 0 || !friendSearch)) && (
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            background: "#fff",
            border: "1px solid #ccc",
            position: "absolute",
            zIndex: 10,
            width: 260,
            maxHeight: 150,
            overflowY: "auto"
          }}>
            {(friendSearch ? filteredFriends : friends.filter(
              f => !members.some(m => m.steam_id === f.steam_id)
            ).slice(0, 20)).map(friend => (
              <li
                key={friend.steam_id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: 4,
                  color: "#222", // dark text for readability
                  background: "#fff"
                }}
                onClick={() => {
                  handleAddMemberDirect(friend.steam_id);
                  setShowDropdown(false);
                }}
              >
                <img
                  src={friend.avatar_url}
                  alt={friend.display_name}
                  style={{ width: 24, height: 24, borderRadius: "50%", marginRight: 8 }}
                />
                {friend.display_name}
              </li>
            ))}
            {(friendSearch ? filteredFriends : friends.filter(
              f => !members.some(m => m.steam_id === f.steam_id)
            ).length === 0) && (
              <li style={{ color: "#888", padding: 4 }}>No friends found</li>
            )}
          </ul>
        )}
      </form>
      {addMsg && <div>{addMsg}</div>}
      {delMsg && <div>{delMsg}</div>}

      <ul>
        {members.map(member => (
          <li key={member.steam_id} style={{ display: "flex", alignItems: "center" }}>
            {member.avatar_url && (
              <img
                src={member.avatar_url}
                alt={member.display_name}
                style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
              />
            )}
            <strong>{member.display_name}</strong>
            {/* Hide Remove button for the owner */}
            {member.steam_id !== ownerSteamId && (
              <button
                style={{ marginLeft: 12, color: "red", border: "none", background: "none", cursor: "pointer" }}
                onClick={() => handleDeleteMember(member.steam_id)}
                title="Remove member"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 30 }}>
        <button onClick={handleSyncGroup} disabled={syncing}>
          {syncing ? "Syncing..." : "Sync Group Games"}
        </button>
        {syncMsg && <div style={{ marginTop: 10 }}>{syncMsg}</div>}
      </div>
      <div style={{ marginTop: 30 }}>
        <button onClick={handleCompareGroupGames} disabled={comparisonLoading}>
          {comparisonLoading ? "Comparing..." : "Compare Group Games"}
        </button>
        {comparisonError && <div style={{ color: "red", marginTop: 10 }}>{comparisonError}</div>}
        {comparisonGames.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4>Common Games</h4>
            <ul>
              {comparisonGames.map(game => (
                <li key={game.appid}>
                  <img src={game.image_url} alt={game.name} style={{ width: 32, marginRight: 8 }} />
                  <strong>{game.name}</strong>
                  <div>Total Playtime: {Math.round(game.total_playtime / 60)} hrs</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;