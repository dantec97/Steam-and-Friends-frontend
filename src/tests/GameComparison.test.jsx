import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GameComparison from "../components/GameComparison";

// Mock apiFetch for all endpoints used in GameComparison
vi.mock("../utils/api", () => ({
  apiFetch: vi.fn((url) => {
    // Mock the friends endpoint
    if (url.includes("/friends_cached")) {
      return Promise.resolve({
        json: () => Promise.resolve([]), // No friends
      });
    }
    // Default: return a resolved promise for any other endpoint
    return Promise.resolve({
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

describe("GameComparison", () => {
  it("shows the default prompt when no friend is selected", async () => {
    render(
      <MemoryRouter>
        <GameComparison />
      </MemoryRouter>
    );
    // This is the actual text shown in your UI
    expect(
      screen.getByText(/Select a friend to compare your games!/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Compare Games With a Friend/i)
    ).toBeInTheDocument();
  });

  it("shows the default prompt if fetch fails", async () => {
    const { apiFetch } = await import("../utils/api");
    apiFetch.mockRejectedValueOnce(new Error("Failed to fetch comparison"));

    render(
      <MemoryRouter>
        <GameComparison />
      </MemoryRouter>
    );
    // The UI still shows the default prompt, not an error message
    expect(
      screen.getByText(/Select a friend to compare your games!/i)
    ).toBeInTheDocument();
  });
});