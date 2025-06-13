import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import MyGames from "./components/MyGames";
import Friends from "./components/Friends";
import FriendGames from "./components/FriendGames";
import GameComparison from "./components/GameComparison";
import Groups from "./components/Groups";
import GroupDetails from "./components/GroupDetails";    
import SteamAuthSuccess from "./components/SteamAuthSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/my_games"
          element={
            <ProtectedRoute>
              <MyGames />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route path="/friends/games" element={<FriendGames />} />
        <Route
          path="/friends/:friendSteamId/games"
          element={
            <ProtectedRoute>
              <FriendGames />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games/:gameId/comparison"
          element={
            <ProtectedRoute>
              <GameComparison />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/steam-auth-success" element={<SteamAuthSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;


// ok im just going to remove the signg up page and keep the log in for new users to use. do we handle when a user is not logged in to redirect them to the login page? i might have disabled some of the security features for development but i would like to re-enable them so i can ensure my app is working properly 