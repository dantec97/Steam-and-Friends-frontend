import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Only if you use navigation

const FriendSearchDropdown = ({ allFriends, friendSteamId }) => {
  const [search, setSearch] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Only if you use navigation

  const filteredFriends = search
    ? allFriends.filter(f =>
        (f.display_name || f.steam_id)
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : allFriends;

  return (
    <div
      className="custom-dropdown"
      tabIndex={0}
      style={{ position: "relative", minWidth: 260 }}
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
              className={friendSteamId === f.steam_id ? "active" : ""}
              onMouseDown={e => {
                e.preventDefault();
                setSearchDropdownOpen(false);
                setSearch("");
                navigate(`/friends/${f.steam_id}/games`);
                // Or call your own handler here if not navigating
              }}
            >
              <img
                src={f.avatar_url}
                alt={f.display_name}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
              {f.display_name || f.steam_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendSearchDropdown;