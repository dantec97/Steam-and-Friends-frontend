import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SidebarNav from "../components/SidebarNav";

beforeEach(() => {
  localStorage.setItem("steam_id", "1234567890");
  localStorage.setItem("account_display_name", "TestUser");
  localStorage.setItem("avatar_url", "/avatar.jpg");
});

afterEach(() => {
  localStorage.clear();
});

describe("SidebarNav", () => {
  it("renders sidebar links and user info", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <SidebarNav />
      </MemoryRouter>
    );

    // Check for sidebar navigation links by role and name
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /my games/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^friends$/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /groups/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /friend's games/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /game comparison/i })).toBeInTheDocument();

    // Check for user info
    expect(screen.getByText(/TestUser/i)).toBeInTheDocument();
    expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
    expect(screen.getByAltText(/avatar/i)).toHaveAttribute("src", "/avatar.jpg");

    // Check for logout button
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
  });
});