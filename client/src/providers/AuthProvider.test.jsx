/**test*/

import { fireEvent, render, screen } from "@testing-library/react";
import { useContext } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AuthContext from "../context/AuthContext";
import * as authApi from "../services/authApi";
import AuthProvider from "./AuthProvider";

vi.mock("../services/authApi", () => ({
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  updateCurrentUser: vi.fn(),
}));

function AuthHarness() {
  const { currentUser, isLoggedIn, login } = useContext(AuthContext);

  return (
    <div>
      <div data-testid="status">{isLoggedIn ? "logged-in" : "logged-out"}</div>
      <div data-testid="user">{currentUser?.name ?? "none"}</div>
      <button
        onClick={() => login({ email: "ada@example.com", password: "secret" })}
      >
        Login
      </button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders children when no token exists", async () => {
    render(
      <AuthProvider>
        <div>Protected app</div>
      </AuthProvider>,
    );

    expect(await screen.findByText("Protected app")).toBeInTheDocument();
  });

  it("logs in the user and exposes auth state through context", async () => {
    vi.mocked(authApi.login).mockResolvedValue({
      token: "fake-token",
      user: { name: "Ada Lovelace" },
    });

    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByTestId("status")).toHaveTextContent("logged-in");
  });
});
