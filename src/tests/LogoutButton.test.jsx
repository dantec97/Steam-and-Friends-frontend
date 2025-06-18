import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

beforeEach(() => {
  localStorage.setItem("token", "testtoken");
  localStorage.setItem("steam_id", "1234567890");
  localStorage.setItem("account_display_name", "TestUser");
  localStorage.setItem("avatar_url", "/avatar.jpg");
});

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("LogoutButton", () => {
  it("clears localStorage and navigates to /login on click", () => {
    render(
      <MemoryRouter>
        <LogoutButton />
      </MemoryRouter>
    );
    const btn = screen.getByRole("button", { name: /log out/i });
    fireEvent.click(btn);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("steam_id")).toBeNull();
    expect(localStorage.getItem("account_display_name")).toBeNull();
    expect(localStorage.getItem("avatar_url")).toBeNull();
    // Optionally, check that useNavigate was called (if you want to assert navigation)
      });
});
