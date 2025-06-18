import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Groups from "../components/Groups";

// Mock apiFetch for all endpoints used in Groups
vi.mock("../utils/api", () => ({
  apiFetch: vi.fn((url) => {
    // Mock the groups endpoint
    if (url.includes("/groups")) {
      return Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              group_id: 1,
              name: "Test Group",
              member_count: 3,
              picture_url: "/group.jpg",
            },
          ]),
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

describe("Groups", () => {
  it("renders the Groups header and Create Group button", async () => {
    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );
    // Wait for the header and button to appear
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /groups/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create group/i })).toBeInTheDocument();
    });
  });

  it("renders a group from the API", async () => {
    render(
      <MemoryRouter>
        <Groups />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Test Group/i)).toBeInTheDocument();
      expect(screen.getByText(/3 members/i)).toBeInTheDocument();
    });
  });
});