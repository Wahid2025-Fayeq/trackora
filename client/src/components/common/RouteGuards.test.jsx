import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useAuth from "../../hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import PublicRoute from "./PublicRoute/PublicRoute";

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

function LoginPage() {
  const location = useLocation();

  return (
    <>
      <div>Login page</div>
      <div data-testid="previous-location">
        {location.state?.from?.pathname || "none"}
      </div>
    </>
  );
}

describe("route guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a protected page for an authenticated user", () => {
    vi.mocked(useAuth).mockReturnValue({ isLoggedIn: true });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Private dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Private dashboard")).toBeInTheDocument();
  });

  it("redirects an unauthenticated user to login", async () => {
    vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false });

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Private dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Login page")).toBeInTheDocument();
    expect(screen.getByTestId("previous-location")).toHaveTextContent(
      "/dashboard",
    );
  });

  it("renders a public page for an unauthenticated user", () => {
    vi.mocked(useAuth).mockReturnValue({ isLoggedIn: false });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <PublicRoute>
          <div>Public login</div>
        </PublicRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText("Public login")).toBeInTheDocument();
  });

  it("redirects an authenticated user away from a public page", async () => {
    vi.mocked(useAuth).mockReturnValue({ isLoggedIn: true });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div>Public login</div>
              </PublicRoute>
            }
          />
          <Route path="/dashboard" element={<div>Private dashboard</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Private dashboard")).toBeInTheDocument();
  });
});
