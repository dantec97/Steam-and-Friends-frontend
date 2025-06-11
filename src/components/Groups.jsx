import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { apiFetch } from "../utils/api";
import "../Styles/Pages.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupPic, setGroupPic] = useState(null);
  const [groupPicPreview, setGroupPicPreview] = useState("");
  const [error, setError] = useState("");
  const steamId = localStorage.getItem("steam_id");
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch(`/api/users/${steamId}/groups`)
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.groups || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [steamId]);

  const handleFormToggle = () => {
    setShowForm((f) => !f);
    setGroupName("");
    setGroupPic(null);
    setGroupPicPreview("");
    setError("");
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    setGroupPic(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGroupPicPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setGroupPicPreview("");
    }
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName) {
      setError("Group name required.");
      return;
    }
    // Example: handle image upload with FormData
    const formData = new FormData();
    formData.append("name", groupName);
    if (groupPic) formData.append("picture", groupPic);

    apiFetch(`/api/users/${steamId}/groups`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setShowForm(false);
        setGroupName("");
        setGroupPic(null);
        setGroupPicPreview("");
        setError("");
        // Refresh groups
        return apiFetch(`/api/users/${steamId}/groups`).then((res) => res.json());
      })
      .then((data) => setGroups(data.groups || data))
      .catch(() => setError("Failed to create group."));
  };

  return (
    <div className="dashboard-root">
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card">
          <div className="mygames-header">
            <h2>Groups</h2>
            <button className="sync-btn-small" onClick={handleFormToggle}>
              {showForm ? "Cancel" : "Create Group"}
            </button>
          </div>
          {showForm && (
            <form className="group-form" onSubmit={handleCreateGroup}>
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="group-input"
                required
              />
              <label className="group-pic-label">
                {groupPicPreview ? (
                  <img src={groupPicPreview} alt="Preview" className="group-pic-preview" />
                ) : (
                  <span>Upload Group Image</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePicChange}
                  className="group-pic-input"
                />
              </label>
              <button type="submit" className="compare-btn" style={{ marginTop: 8 }}>
                Create
              </button>
              {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
            </form>
          )}
          <ul>
            {groups.map((group) => (
              <li key={group.group_id} className="mygames-list-item">
                <img
                  src={group.picture_url || "/Logo.jpeg"}
                  alt={group.name}
                  className="avatar"
                />
                <div className="mygames-info">
                  <strong>{group.name}</strong>
                  <span className="mygames-playtime">
                    {group.member_count} members
                  </span>
                </div>
                <button
                  className="compare-btn"
                  onClick={() => navigate(`/groups/${group.group_id}`)}
                >
                  View Group
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Groups;

// when a user creates a group they should be redirected to the group page such 
// as http://localhost:5173/groups/3, this page should have options to edit the group such as add members or remove members