import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../components/Login";

// Mock apiFetch for login
vi.mock("../utils/api", () => ({
  apiFetch: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("Login", () => {
  it("renders the Steam login button", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /sign in with steam/i })).toBeInTheDocument();
  });

  // Add more tests here if your Login component supports error display or form submission
});