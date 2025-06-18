import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Friends from "../components/Friends";

// Mock apiFetch
vi.mock("../utils/api", () => ({
  apiFetch: vi.fn(),
}));

describe("Friends", () => {
  beforeEach(() => {
    localStorage.setItem("steam_id", "1234567890");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows loading then friends", async () => {
    const { apiFetch } = await import("../utils/api");
    apiFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        friends: [
          { steam_id: "2", display_name: "Alyx", avatar_url: "" },
        ],
      }),
    });

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading friends/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Alyx/)).toBeInTheDocument();
    });
  });

  it("shows error if fetch fails", async () => {
    const { apiFetch } = await import("../utils/api");
    apiFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Failed to fetch friends" }),
    });

    render(
      <MemoryRouter>
        <Friends />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch friends/i)).toBeInTheDocument();
    });
  });
});