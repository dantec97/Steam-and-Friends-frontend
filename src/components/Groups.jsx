import React, { useState } from "react";

const Groups = () => {
  const [groupName, setGroupName] = useState("");
  const [message, setMessage] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [steamIds, setSteamIds] = useState(""); // comma-separated input
  const steamId = localStorage.getItem("steam_id");

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: groupName, owner_steam_id: steamId }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Group "${data.name}" created!`);
      setGroupName("");
    } else {
      setMessage(data.error || "Failed to create group");
    }
  };

  const handleSyncGroup = async () => {
    setSyncing(true);
    setSyncMsg("");
    const ids = steamIds.split(",").map((id) => id.trim()).filter(Boolean);
    const res = await fetch("/api/sync_group_games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steam_ids: ids }),
    });
    const data = await res.json();
    setSyncing(false);
    setSyncMsg(data.synced ? "Group sync complete!" : (data.error || "Sync failed"));
  };

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

      <div style={{ marginTop: 20 }}>
        <h3>Sync Group Games</h3>
        <input
          type="text"
          placeholder="Comma-separated Steam IDs"
          value={steamIds}
          onChange={(e) => setSteamIds(e.target.value)}
          style={{ width: 300 }}
        />
        <button onClick={handleSyncGroup} disabled={syncing}>
          {syncing ? "Syncing..." : "Sync Group Games"}
        </button>
        {syncMsg && <div style={{ marginTop: 10 }}>{syncMsg}</div>}
      </div>
    </div>
  );
};

export default Groups;