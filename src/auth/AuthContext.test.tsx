import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../api/auth", () => ({
  login: vi.fn(),
  fetchMe: vi.fn(),
}));
vi.mock("../api/client", () => ({
  setAuthToken: vi.fn(),
}));

import { login as apiLogin, fetchMe } from "../api/auth";
import { setAuthToken } from "../api/client";

const TOKEN_KEY = "ecommerce_token";
const mockAdmin = {
  id: 1,
  email: "admin@test.com",
  full_name: "Admin Test",
  role: "administrador" as const,
  is_active: true,
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("estado inicial", () => {
  it("arranca con user = null cuando no hay token en localStorage", async () => {
    // Arrange & Act
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Assert
    await waitFor(() => expect(result.current.user).toBeNull());
    expect(fetchMe).not.toHaveBeenCalled();
  });
});

describe("restaurar sesión desde localStorage", () => {
  it("restaura el usuario cuando el token almacenado es válido", async () => {
    // Arrange
    localStorage.setItem(TOKEN_KEY, "valid-token");
    vi.mocked(fetchMe).mockResolvedValue(mockAdmin);

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Assert
    await waitFor(() => expect(result.current.user).toEqual(mockAdmin));
    expect(setAuthToken).toHaveBeenCalledWith("valid-token");
  });

  it("elimina el token cuando fetchMe falla (token expirado)", async () => {
    // Arrange
    localStorage.setItem(TOKEN_KEY, "expired-token");
    vi.mocked(fetchMe).mockRejectedValue(new Error("401 Unauthorized"));

    // Act
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    // Assert
    await waitFor(() => expect(result.current.user).toBeNull());
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(setAuthToken).toHaveBeenLastCalledWith(null);
  });
});

describe("login()", () => {
  it("guarda token en localStorage y establece user tras login exitoso", async () => {
    // Arrange
    vi.mocked(apiLogin).mockResolvedValue("fresh-token");
    vi.mocked(fetchMe).mockResolvedValue(mockAdmin);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.user).toBeNull());

    // Act
    let returned: unknown;
    await act(async () => {
      returned = await result.current.login("admin@test.com", "secret");
    });

    // Assert
    expect(returned).toEqual(mockAdmin);
    expect(result.current.user).toEqual(mockAdmin);
    expect(localStorage.getItem(TOKEN_KEY)).toBe("fresh-token");
    expect(setAuthToken).toHaveBeenCalledWith("fresh-token");
  });

  it("propaga el error cuando las credenciales son inválidas", async () => {
    // Arrange
    vi.mocked(apiLogin).mockRejectedValue(new Error("Credenciales inválidas"));
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.user).toBeNull());

    // Act & Assert
    await expect(
      act(async () => {
        await result.current.login("bad@test.com", "wrong");
      }),
    ).rejects.toThrow();

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});

describe("logout()", () => {
  it("borra user y token tras cerrar sesión", async () => {
    // Arrange – simular sesión activa restaurada desde localStorage
    localStorage.setItem(TOKEN_KEY, "active-token");
    vi.mocked(fetchMe).mockResolvedValue(mockAdmin);
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.user).toEqual(mockAdmin));

    // Act
    act(() => result.current.logout());

    // Assert
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(setAuthToken).toHaveBeenLastCalledWith(null);
  });
});

describe("useAuth fuera del provider", () => {
  it("lanza error descriptivo si se usa fuera de AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth debe usarse dentro de AuthProvider",
    );
    spy.mockRestore();
  });
});
