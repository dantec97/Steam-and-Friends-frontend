import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { apiFetch } from "../utils/api";
import LavaLampBackground from "./LavaLampBackground";
import "../Styles/Pages.css";
import Loader from "./Loader";

const FriendsWithGame = () => {
  const { gameId } = useParams();
  const steamId = localStorage.getItem("steam_id");
  const [friends, setFriends] = useState([]);
  const [myPlaytime, setMyPlaytime] = useState(null);
  const [gameName, setGameName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch(`/api/users/${steamId}/games/${gameId}/playtime`).then(res => res.json()),
      apiFetch(`/api/users/${steamId}/games/${gameId}/friends`).then(res => res.json())
    ])
      .then(([myGame, friendsWithGame]) => {
        setMyPlaytime(myGame.playtime_minutes ?? 0);
        setGameName(myGame.game_name ?? "");
        setFriends(friendsWithGame || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [gameId, steamId]);

  function formatPlaytime(minutes) {
    if (minutes == null) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  return (
    <div className="dashboard-root">
      <LavaLampBackground />
      <SidebarNav />
      <main className="dashboard-main">
        <div className="page-card">
          <h2>Friends Who Play {gameName || "This Game"}</h2>
          {loading ? (
            <div className="center-flex">
              <Loader message="Loading friends with this game..." />
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <strong>Your Playtime:</strong> {formatPlaytime(myPlaytime)}
              </div>
              {friends.length === 0 ? (
                <div>None of your friends play this game.</div>
              ) : (
                <ul>
                  {friends.map(friend => (
                    <li key={friend.steam_id} className="mygames-list-item">
                      <img
                        src={friend.avatar_url && friend.avatar_url.trim() !== "" ? friend.avatar_url : "/Logo.jpeg"}
                        alt={friend.display_name}
                        className="avatar"
                      />
                      <div className="mygames-info">
                        <strong>{friend.display_name || friend.steam_id}</strong>
                        <span className="mygames-playtime">
                          {formatPlaytime(friend.playtime_minutes)} played
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FriendsWithGame;