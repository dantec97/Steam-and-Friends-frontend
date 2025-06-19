# 🎮 Steam and Friends – Frontend

A stylish, interactive React SPA for exploring, comparing, and sharing your Steam library, playtime, and gaming stats with friends and groups.

---

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
   git clone <your-repo-url>
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