import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { apiFetch } from "./api";

describe("apiFetch happy path", () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch");
    localStorage.clear();
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    localStorage.clear();
  });

  it("logs in successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "fake-jwt",
        steam_id: "1234567890"
      }),
    });

    const res = await apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ account_display_name: "testuser", password: "testpass" }),
    });
    const data = await res.json();

    expect(data.access_token).toBe("fake-jwt");
    expect(data.steam_id).toBe("1234567890");
  });

  it("signs up successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        steam_id: "1234567890",
        account_display_name: "testuser"
      }),
    });

    const res = await apiFetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ steam_id: "1234567890", account_display_name: "testuser", password: "testpass" }),
    });
    const data = await res.json();

    expect(data.account_display_name).toBe("testuser");
  });

  it("syncs games successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Games synced successfully."
      }),
    });

    localStorage.setItem("token", "fake-jwt");
    const res = await apiFetch("/api/users/1234567890/fetch_games", { method: "POST" });
    const data = await res.json();

    expect(data.message).toMatch(/synced/i);
  });

  it("creates a group successfully", async () => {
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        group_id: 1,
        name: "Test Group"
      }),
    });

    localStorage.setItem("token", "fake-jwt");
    const res = await apiFetch("/api/groups", {
      method: "POST",
      body: JSON.stringify({ name: "Test Group", owner_steam_id: "1234567890" }),
    });
    const data = await res.json();

    expect(data.name).toBe("Test Group");
    expect(data.group_id).toBe(1);
  });
});