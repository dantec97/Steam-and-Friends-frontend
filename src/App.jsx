import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
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
import NotFound from "./components/NotFound";
import FriendsWithGame from "./components/FriendsWithGame";


function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/friends/games"
          element={
            <ProtectedRoute>
              <FriendGames />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/games/:gameId/friends"
          element={
            <ProtectedRoute>
              <FriendsWithGame />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

//SIMPLE TEST APP FROM WHEN THINGS WERE NOT GOING SO WELL.....
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SteamAuthSuccess from "./components/SteamAuthSuccess";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/steam-auth-success" element={<SteamAuthSuccess />} />
//         <Route path="*" element={<div>Not Found</div>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;