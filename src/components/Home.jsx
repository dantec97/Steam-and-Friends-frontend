import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const steamId = localStorage.getItem("steam_id") || "<your_steam_id>";
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24 }}>
      <h1>Steam & Friends Dev Home</h1>
      <ul style={{ fontSize: "1.1em" }}>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/my_games">My Games</Link></li>
        <li><Link to="/friends">My Friends</Link></li>
        <li>
          <Link to={`/friends/${steamId}/games`}>Friend's Games (replace steam_id)</Link>
        </li>
        <li><Link to="/groups">Groups</Link></li>
        <li>
          <Link to="/groups/1">Group Details (replace 1 with groupId)</Link>
        </li>
        <li>
          <Link to="/games/1/comparison">Game Comparison (replace 1 with gameId)</Link>
        </li>
      </ul>
      <p style={{ color: "#888", marginTop: 24 }}>
        This is a development placeholder. Update this page to become your dashboard!
      </p>
    </div>
  );
};

export default Home;