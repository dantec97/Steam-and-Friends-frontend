import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyGames from "../components/MyGames";

// Mock apiFetch for all endpoints used in MyGames
vi.mock("../utils/api", () => ({
  apiFetch: vi.fn((url) => {
    // Mock the games endpoint
    if (url.includes("/games")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            games: [
              { appid: 1, name: "Half-Life", image_url: "", playtime_minutes: 120, id: 1 },
            ],
          }),
      });
    }
    // Default: return a resolved promise for any other endpoint
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    });
  }),
}));

beforeEach(() => {
  localStorage.setItem("steam_id", "1234567890");
  vi.clearAllMocks();
});

afterEach(() => {
  localStorage.clear();
});

describe("MyGames", () => {
  it("shows loading then games", async () => {
    render(
      <MemoryRouter>
        <MyGames />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading games/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Half-Life/i)).toBeInTheDocument();
    });
  });

  it("shows empty state if no games", async () => {
    const { apiFetch } = await import("../utils/api");
    apiFetch.mockImplementationOnce((url) => {
      if (url.includes("/games")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ games: [] }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    render(
      <MemoryRouter>
        <MyGames />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/no games found/i)).toBeInTheDocument();
    });
  });

  it("shows error if fetch fails", async () => {
    const { apiFetch } = await import("../utils/api");
    apiFetch.mockImplementationOnce(() => Promise.reject(new Error("Failed to fetch games")));

    render(
      <MemoryRouter>
        <MyGames />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch games/i)).toBeInTheDocument();
    });
  });
});