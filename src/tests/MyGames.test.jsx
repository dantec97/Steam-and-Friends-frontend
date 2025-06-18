import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyGames from "../components/MyGames";

// Mock apiFetch
vi.mock("../utils/api", () => ({
  apiFetch: vi.fn(),
}));

describe("MyGames", () => {
  beforeEach(() => {
    localStorage.setItem("steam_id", "1234567890");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows loading then games", async () => {
    const { apiFetch } = await import("../utils/api");
    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        games: [
          { appid: 1, name: "Half-Life", image_url: "", playtime_minutes: 120, id: 1 },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <MyGames />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading games/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Half-Life/)).toBeInTheDocument();
    });
  });

  it("shows error if fetch fails", async () => {
    const { apiFetch } = await import("../utils/api");
    apiFetch.mockRejectedValueOnce(new Error("Failed to fetch games"));

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