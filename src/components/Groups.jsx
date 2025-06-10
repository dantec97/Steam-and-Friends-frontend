import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
const DEFAULT_GROUP_PIC = "/Logo.jpeg"; // Or any placeholder image

const Groups = () => {
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [steamIds, setSteamIds] = useState("");
  const [groups, setGroups] = useState([]);
  const [ownedGroups, setOwnedGroups] = useState([]);
  const steamId = localStorage.getItem("steam_id");
  const navigate = useNavigate();

  // Fetch all groups and owned groups
  useEffect(() => {
    if (!steamId) return;
    apiFetch(`/api/users/${steamId}/groups`)
      .then((res) => res.json())
      .then((data) => setGroups(data))
      .catch(() => setGroups([]));
    apiFetch(`/api/users/${steamId}/groups_owned`)
      .then((res) => res.json())
      .then((data) => setOwnedGroups(data))
      .catch(() => setOwnedGroups([]));
  }, [steamId, message]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await apiFetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName, owner_steam_id: steamId }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Group "${data.name}" created!`);
      setGroupName("");
      // Optionally, refresh groups list here
      apiFetch(`/api/users/${steamId}/groups`)
        .then((res) => res.json())
        .then((data) => setGroups(data || []));
    } else {
      setMessage(data.error || "Failed to create group");
    }
  };

  const handleSyncGroup = async () => {
    setSyncing(true);
    setSyncMsg("");
    const ids = steamIds.split(",").map((id) => id.trim()).filter(Boolean);
    const res = await apiFetch("/api/sync_group_games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam_ids: ids }),
    });
    const data = await res.json();
    setSyncing(false);
    setSyncMsg(data.synced ? "Group sync complete!" : data.error || "Sync failed");
  };

  const getGroupPic = (group) =>
    group.picture_url && group.picture_url.trim() !== "" ? group.picture_url : DEFAULT_GROUP_PIC;

  return (
    <div>
      <h2>Create a Group</h2>
      <form onSubmit={handleCreateGroup}>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <button type="submit">Create Group</button>
      </form>
      {message && <div style={{ marginTop: 10 }}>{message}</div>}

      <div style={{ marginTop: 30 }}>
        <h3>Groups I Own</h3>
        <ul>
          {ownedGroups.length === 0 && <li>No groups owned.</li>}
          {ownedGroups.map((group) => (
            <li key={group.group_id} style={{ display: "flex", alignItems: "center" }}>
              <img
                src={getGroupPic(group)}
                alt="Group"
                style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8 }}
              />
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate(`/groups/${group.group_id}`)}
              >
                {group.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>All Groups (I'm a Member)</h3>
        <ul>
          {groups.length === 0 && <li>No group memberships.</li>}
          {groups.map((group) => (
            <li key={group.group_id} style={{ display: "flex", alignItems: "center" }}>
              <img
                src={getGroupPic(group)}
                alt="Group"
                style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8 }}
              />
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate(`/groups/${group.group_id}`)}
              >
                {group.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default Groups;

// when a user creates a group they should be redirected to the group page such 
// as http://localhost:5173/groups/3, this page should have options to edit the group such as add members or remove members