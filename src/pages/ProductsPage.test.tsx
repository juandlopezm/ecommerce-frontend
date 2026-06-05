import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ProductsPage } from "./ProductsPage";
import { ToastProvider } from "../ui/ToastContext";
import type { Product } from "../types";

vi.mock("../api/products", () => ({
  listProducts: vi.fn(),
  getProduct: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));
vi.mock("../auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, email: "admin@test.com", full_name: "Admin Test", role: "administrador", is_active: true },
    logout: vi.fn(),
    login: vi.fn(),
  })),
}));

import { listProducts, deleteProduct } from "../api/products";

const makeProduct = (id: number, name: string): Product => ({
  id,
  name,
  description: "",
  price: "29900",
  stock: 5,
  brand: "GlowBrand",
  category: "Labios",
  image_url: "",
  is_active: true,
  is_available: true,
});

function renderProducts() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <ProductsPage />
      </ToastProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => vi.clearAllMocks());

describe("ProductsPage", () => {
  it("muestra 'Cargando…' mientras se obtienen los productos", () => {
    vi.mocked(listProducts).mockImplementation(() => new Promise(() => {}));

    renderProducts();

    expect(screen.getByText("Cargando…")).toBeInTheDocument();
  });

  it("muestra la tabla con los productos tras la carga exitosa", async () => {
    // Arrange
    vi.mocked(listProducts).mockResolvedValue([
      makeProduct(1, "Labial Rosa"),
      makeProduct(2, "Sérum Vitamina C"),
    ]);

    // Act
    renderProducts();

    // Assert
    await waitFor(() => expect(screen.getByText("Labial Rosa")).toBeInTheDocument());
    expect(screen.getByText("Sérum Vitamina C")).toBeInTheDocument();
  });

  it("muestra error cuando listProducts falla", async () => {
    // Arrange
    vi.mocked(listProducts).mockRejectedValue(new Error("Network error"));

    // Act
    renderProducts();

    // Assert
    await waitFor(() =>
      expect(screen.getByText("No se pudieron cargar los productos.")).toBeInTheDocument(),
    );
  });

  it("muestra el formulario de creación al hacer clic en '+ Nuevo producto'", async () => {
    // Arrange
    vi.mocked(listProducts).mockResolvedValue([]);

    // Act
    renderProducts();
    await waitFor(() => screen.getByText("+ Nuevo producto"));
    fireEvent.click(screen.getByText("+ Nuevo producto"));

    // Assert – el formulario de nuevo producto aparece con su título
    expect(screen.getByText("Nuevo producto")).toBeInTheDocument();
  });

  it("llama a deleteProduct (tras confirmar) y recarga la lista", async () => {
    // Arrange
    vi.mocked(listProducts).mockResolvedValue([makeProduct(1, "Labial Rosa")]);
    vi.mocked(deleteProduct).mockResolvedValue(undefined);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    // Act
    renderProducts();
    await waitFor(() => screen.getByText("Labial Rosa"));
    fireEvent.click(screen.getByRole("button", { name: /eliminar/i }));

    // Assert
    await waitFor(() => expect(deleteProduct).toHaveBeenCalledWith(1));
    expect(listProducts).toHaveBeenCalledTimes(2); // carga inicial + recarga

    vi.restoreAllMocks();
  });
});
