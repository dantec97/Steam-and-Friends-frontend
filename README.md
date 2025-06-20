# 🎮 Steam and Friends – Frontend

**Steam and Friends** is a sleek, interactive React single-page app (SPA) that brings your Steam library to life.  
It lets you **explore your games**, **compare stats** with friends, and **discover common games** faster than ever — no more endless scrolling or debating what to play!

Create custom groups with your gaming buddies, instantly see shared games and playtime, and plan your next session with ease.  
Think of it as the social layer Steam *should* have had all along — wrapped in a neon-inspired, mobile-friendly UI that feels at home in any gamer’s setup.

🌟 **Play together, smarter. Game nights just got easier.**

---

## 🌐 Live Demo

👉 [Check out Steam and Friends live on Render](https://steam-and-friends-frontend.onrender.com/)

---

## 📸 Preview

![Steam and Friends Screenshot](https://raw.githubusercontent.com/dantec97/Steam-and-Friends-frontend/main/public/Dashboard.png)

*Above: Example of the dashboard view with shared games highlighted*

---

## 🕹️ Instructions for Use

Getting started with **Steam and Friends** is easy! Follow these steps to explore, sync, and compare your games with friends:

1️⃣ **Log in with Steam**  
   - Click the login button and authenticate securely using Steam OpenID.

2️⃣ **Sync your games**  
   - After logging in, navigate to the **My Games** page.
   - Click the **Sync Games** button to fetch your library and playtime data.

3️⃣ **Sync your friends**  
   - Head over to the **Friends** page.
   - Click **Sync Friends** to pull in your Steam friends and their game data.

4️⃣ **Create a group**  
   - Go to the **Groups** section.
   - Create a new group and add friends using the search-and-select tool.
   - Instantly see common games and shared playtime across your group!

5️⃣ **Explore your games and connections**  
   - On **My Games**, you can view your library with detailed stats.
   - For any game, click the **See Friends Who Play** button to find out which friends play that game too.

🌟 That’s it — you’re ready to discover shared games and plan your next gaming session with ease!


## ✨ Features

- **Modern Steam Login**
  - Secure Steam OpenID authentication
  - JWT-based session management

- **Game Library**
  - View your synced Steam games and playtime
  - Beautiful, responsive game cards and stats

- **Friends Integration**
  - See your Steam friends and their games
  - Instantly compare your library with any friend
  - Find common games and playtime overlaps

- **Groups & Social**
  - Create and manage custom groups
  - Add friends to groups with a slick search and selection UI
  - Compare group-wide shared games and playtime
  - Edit group details and members anytime

- **Playtime & Stats**
  - Visualize your total playtime with animated gauges and charts
  - See your top games and your friends’ top games
  - Discover which friends play a specific game

- **Sync & Refresh**
  - One-click syncing for your games and friends
  - Real-time updates for group and friend data

- **Mobile-Ready & Accessible**
  - Fully responsive design
  - Keyboard navigation and accessible components

---

## 🛠️ Tech Stack

- **React 18+**
- **React Router v6**
- **Recharts** (data visualization)
- **Jest + React Testing Library** (unit tests)
- **Custom CSS** (neon/retro-inspired, dark mode)
- **Vite** (fast dev/build)

---

## 🚀 Getting Started

1. **Clone the Repo**
   ```sh
   git clone https://github.com/dantec97/Steam-and-Friends-frontend
   cd front_end/Steam_and_Friends
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Configure Environment**
   - By default, the frontend expects the backend at `http://localhost:5000`.
   - If needed, update API URLs in `src/utils/api.js`.

4. **Run the App**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🖥️ Project Structure

```
src/
  components/      # All React components (Dashboard, Friends, Groups, etc.)
  Styles/          # CSS files for pages and components
  utils/           # API helpers and utilities
  tests/           # Unit and integration tests
  App.jsx          # Main app router
  main.jsx         # Entry point
```

---

## 🧪 Testing

- Tests are in the `src/tests/` directory.
- Run all tests with:
  ```sh
  npm test
  ```
- Uses [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/)
---

## 🎨 Design & UX

- **Neon-accented, dark mode UI** for a fun, modern gaming vibe
- Animated backgrounds and interactive cards
- Scrollable, searchable dropdowns for large friend lists
- Responsive layouts for desktop and mobile
- Friendly error messages and loading states

---

## 🤝 API Integration

This frontend communicates with the [Steam and Friends Backend](https://github.com/your-backend-repo) via REST API.  
See the backend README for API details.

---

## 👤 Author

Dante Cancellieri  
[LinkedIn](https://www.linkedin.com/in/dante-cancellieri/)

---

## 📄 License

idk pls don't sue me Steam, I love you <3

---

> **Capstone Project – 2025**  
> Built from scratch with React, Vite, and a love for games,
