import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

vi.mock("./AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "./AuthContext";

const adminUser = {
  id: 1,
  email: "admin@test.com",
  full_name: "Admin Test",
  role: "administrador" as const,
  is_active: true,
};

beforeEach(() => vi.clearAllMocks());

describe("ProtectedRoute", () => {
  it("redirige a /login cuando no hay usuario autenticado", () => {
    // Arrange
    vi.mocked(useAuth).mockReturnValue({ user: null, login: vi.fn(), logout: vi.fn() });

    // Act
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Contenido protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Página de login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText("Página de login")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("muestra el contenido protegido cuando hay un usuario autenticado", () => {
    // Arrange
    vi.mocked(useAuth).mockReturnValue({ user: adminUser, login: vi.fn(), logout: vi.fn() });

    // Act
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <div>Contenido protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Página de login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Assert
    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
    expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
  });
});
