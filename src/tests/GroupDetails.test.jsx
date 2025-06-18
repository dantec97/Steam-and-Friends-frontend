import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import GroupDetails from "../components/GroupDetails";

// Mock apiFetch for all endpoints used in GroupDetails
vi.mock("../utils/api", () => ({
  apiFetch: vi.fn((url, opts) => {
    // Group members
    if (url.includes("/groups/") && url.includes("/members")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              steam_id: "1",
              display_name: "Alyx",
              avatar_url: "/alyx.jpg",
              user_id: 1,
            },
            {
              steam_id: "2",
              display_name: "Barney",
              avatar_url: "/barney.jpg",
              user_id: 2,
            },
          ]),
      });
    }
    // Group info
    if (url.match(/\/groups\/\d+$/)) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            group_id: 3,
            name: "Test Group",
            owner_id: 1,
            picture_url: "/group.jpg",
          }),
      });
    }
    // Friends list
    if (url.includes("/friends_cached")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            friends: [
              {
                steam_id: "3",
                display_name: "Dog",
                avatar_url: "/dog.jpg",
              },
            ],
          }),
      });
    }
    // Shared games (default: success)
    if (url.includes("/shared_games")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              appid: 42,
              name: "Portal 2",
              image_url: "/portal2.jpg",
              total_playtime: 240,
              playtimes: { "1": 120, "2": 120 },
            },
          ]),
      });
    }
    // Default
    return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
  }),
}));

beforeEach(() => {
  localStorage.setItem("steam_id", "1234567890");
  vi.clearAllMocks();
});
afterEach(() => {
  localStorage.clear();
});

function renderWithRouter(groupId = "3") {
  return render(
    <MemoryRouter initialEntries={[`/groups/${groupId}`]}>
      <Routes>
        <Route path="/groups/:groupId" element={<GroupDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("GroupDetails", () => {
  it("shows loading then group info and members", async () => {
    renderWithRouter();
    expect(screen.getByText(/loading group members/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Test Group/i)).toBeInTheDocument();
      expect(screen.getByText(/Alyx/i)).toBeInTheDocument();
      expect(screen.getByText(/Barney/i)).toBeInTheDocument();
    });
  });

  it("shows friends in add member dropdown", async () => {
    renderWithRouter();
    const input = await screen.findByPlaceholderText(/search for a friend to add/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Dog" } });
    await waitFor(() => {
      expect(screen.getByText(/Dog/i)).toBeInTheDocument();
    });
  });

  it("shows group common games after clicking Compare Group Games", async () => {
    renderWithRouter();
    const compareBtn = await screen.findByRole("button", { name: /compare group games/i });
    fireEvent.click(compareBtn);
    await waitFor(() => {
      expect(screen.getByText(/Common Games/i)).toBeInTheDocument();
      expect(screen.getByText(/Portal 2/i)).toBeInTheDocument();
    });
  });

  it("shows error if shared games fetch fails", async () => {
    // Patch the mock for this test only
    const { apiFetch } = await import("../utils/api");
    apiFetch.mockImplementation((url) => {
      if (url.includes("/shared_games")) {
        return Promise.reject(new Error("Network error."));
      }
      // Use the default mock for other endpoints
      if (url.includes("/groups/") && url.includes("/members")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                steam_id: "1",
                display_name: "Alyx",
                avatar_url: "/alyx.jpg",
                user_id: 1,
              },
              {
                steam_id: "2",
                display_name: "Barney",
                avatar_url: "/barney.jpg",
                user_id: 2,
              },
            ]),
        });
      }
      if (url.match(/\/groups\/\d+$/)) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              group_id: 3,
              name: "Test Group",
              owner_id: 1,
              picture_url: "/group.jpg",
            }),
        });
      }
      if (url.includes("/friends_cached")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              friends: [
                {
                  steam_id: "3",
                  display_name: "Dog",
                  avatar_url: "/dog.jpg",
                },
              ],
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });

    renderWithRouter();
    const compareBtn = await screen.findByRole("button", { name: /compare group games/i });
    fireEvent.click(compareBtn);
    await waitFor(() => {
          expect(screen.getByText("Network error.")).toBeInTheDocument();
        });
      });
    });