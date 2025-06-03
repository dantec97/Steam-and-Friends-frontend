import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MyGames from "./components/MyGames";
import Friends from "./components/Friends";
import FriendGames from "./components/FriendGames";
import GameComparison from "./components/GameComparison";
import Groups from "./components/Groups";
// import Groups from "./components/Groups";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my_games" element={<MyGames />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/friends/:friendSteamId/games" element={<FriendGames />} />
        <Route path="/games/:gameId/comparison" element={<GameComparison />} />
        <Route path='/groups' element={<Groups />} />
      </Routes>
    </Router>
  );
}

export default App;








// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import { useEffect, useState } from 'react';

// function App() {
//   const [msg, setMsg] = useState('');

//   useEffect(() => {
//     fetch('/api/hello')
//       .then((res) => res.json())
//       .then((data) => setMsg(data.message));
//   }, []);

//   return (
//     <div>
//       <h1>{msg}</h1>
//     </div>
//   );
// }

// export default App;

