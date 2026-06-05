import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./LoginPage";

vi.mock("../auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from "../auth/AuthContext";

const adminUser = {
  id: 1,
  email: "admin@test.com",
  full_name: "Admin Test",
  role: "administrador" as const,
  is_active: true,
};
const clientUser = { ...adminUser, role: "cliente" as const };

let mockLogin: ReturnType<typeof vi.fn>;
let mockLogout: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockLogin = vi.fn();
  mockLogout = vi.fn();
  vi.mocked(useAuth).mockReturnValue({ user: null, login: mockLogin, logout: mockLogout });
});

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<div>Panel de administración</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  it("muestra el formulario con campos de correo, contraseña y botón de envío", () => {
    renderLogin();

    expect(screen.getByPlaceholderText("admin@ecommerce.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("navega a /admin tras un login exitoso con rol administrador", async () => {
    // Arrange
    mockLogin.mockResolvedValue(adminUser);

    // Act
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText("admin@ecommerce.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Panel de administración")).toBeInTheDocument(),
    );
  });

  it("muestra error cuando el usuario no tiene rol administrador", async () => {
    // Arrange
    mockLogin.mockResolvedValue(clientUser);

    // Act
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText("admin@ecommerce.com"), {
      target: { value: "cliente@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText("Esta cuenta no tiene permisos de administrador."),
      ).toBeInTheDocument(),
    );
    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it("muestra error de credenciales inválidas cuando login falla", async () => {
    // Arrange
    mockLogin.mockRejectedValue(new Error("401 Unauthorized"));

    // Act
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText("admin@ecommerce.com"), {
      target: { value: "bad@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText(/Credenciales inválidas/),
      ).toBeInTheDocument(),
    );
  });

  it("deshabilita el botón y muestra 'Entrando…' mientras se procesa el login", async () => {
    // Arrange: login que no resuelve de inmediato
    let resolve: (u: typeof adminUser) => void;
    mockLogin.mockImplementation(
      () => new Promise<typeof adminUser>((res) => { resolve = res; }),
    );

    // Act
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText("admin@ecommerce.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    // Assert – en estado de carga
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /entrando/i })).toBeDisabled(),
    );

    // Cleanup
    act(() => resolve(adminUser));
  });
});
