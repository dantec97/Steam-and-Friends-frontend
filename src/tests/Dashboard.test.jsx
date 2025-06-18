// src/tests/Dashboard.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../components/Dashboard";

// Mock apiFetch for all endpoints Dashboard needs
vi.mock("../utils/api", () => ({
  apiFetch: vi.fn((url) => {
    if (url.includes("/games")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ appid: 1, name: "Game 1", playtime_minutes: 120, image_url: "/logo.jpeg" }])
      });
    }
    if (url.includes("/friends_top_games")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ appid: 2, name: "Game 2", total_playtime: 60, image_url: "/logo.jpeg" }])
      });
    }
    if (url.includes("/friends")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ steam_id: "123", display_name: "Friend 1", avatar_url: "/logo.jpeg" }])
      });
    }
    if (url.includes("/groups")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ group_id: 1, name: "Group 1", member_count: 2, picture_url: "/logo.jpeg" }])
      });
    }
    if (url.includes("/total_playtime")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ total_playtime_minutes: 120 })
      });
    }
    if (url.includes("/shared_games")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ appid: 1, name: "Marvel Rivals", playtime_minutes: 360, image_url: "/logo.jpeg" }])
      });
    }
    // fallback for any other endpoint
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  }),
}));

beforeEach(() => {
  // Set up localStorage for SidebarNav and Dashboard
  localStorage.setItem("steam_id", "76561199867607180");
  localStorage.setItem("account_display_name", "Dante_devtest");
  localStorage.setItem("avatar_url", "/Logo.jpeg");
});

afterEach(() => {
  localStorage.clear();
});

test("renders Compare Games section", async () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByText(/Compare Games/i)).toBeInTheDocument()
  );
});
test("renders Total Playtime section", async () => {
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
  await waitFor(() =>
    expect(screen.getByText(/Total Playtime/i)).toBeInTheDocument()
  );
});