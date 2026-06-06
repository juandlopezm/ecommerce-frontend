import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { CatalogPage } from "./CatalogPage";
import { CartProvider } from "../cart/CartContext";
import { ToastProvider } from "../ui/ToastContext";
import type { Product } from "../types";

vi.mock("../api/products", () => ({
  listProducts: vi.fn(),
  getProduct: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

// Simplificar componentes decorativos para centrar el test en la lógica del catálogo
vi.mock("../components/HeroBanner", () => ({ HeroBanner: () => null }));
vi.mock("../components/FilterSidebar", () => ({
  FilterSidebar: () => <div data-testid="filter-sidebar" />,
}));
vi.mock("../components/CategoryCircles", () => ({
  CategoryCircles: () => <div data-testid="category-circles" />,
}));
vi.mock("../components/ProductCard", () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid={`product-${product.id}`}>{product.name}</div>
  ),
}));

import { listProducts } from "../api/products";

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  name: "Labial Rosa",
  description: "",
  price: "29900",
  stock: 5,
  brand: "GlowBrand",
  category: "Labios",
  image_url: "",
  is_active: true,
  is_available: true,
  ...overrides,
});

function renderCatalog() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ToastProvider>
          <CatalogPage />
        </ToastProvider>
      </CartProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("CatalogPage", () => {
  it("muestra indicador de carga mientras obtiene los productos", () => {
    // Arrange: listProducts no resuelve aún
    vi.mocked(listProducts).mockImplementation(() => new Promise(() => {}));

    // Act
    renderCatalog();

    // Assert
    expect(screen.getByText("Cargando…")).toBeInTheDocument();
  });

  it("muestra los productos activos tras la carga exitosa", async () => {
    // Arrange
    vi.mocked(listProducts).mockResolvedValue([
      makeProduct({ id: 1, name: "Labial Rosa" }),
      makeProduct({ id: 2, name: "Sérum Vitamina C" }),
    ]);

    // Act
    renderCatalog();

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Labial Rosa")).toBeInTheDocument(),
    );
    expect(screen.getByText("Sérum Vitamina C")).toBeInTheDocument();
  });

  it("excluye los productos con is_active = false", async () => {
    // Arrange
    vi.mocked(listProducts).mockResolvedValue([
      makeProduct({ id: 1, name: "Visible", is_active: true }),
      makeProduct({ id: 2, name: "Oculto", is_active: false }),
    ]);

    // Act
    renderCatalog();

    // Assert
    await waitFor(() => expect(screen.getByText("Visible")).toBeInTheDocument());
    expect(screen.queryByText("Oculto")).not.toBeInTheDocument();
  });

  it("muestra error cuando la API falla al cargar el catálogo", async () => {
    // Arrange
    vi.mocked(listProducts).mockRejectedValue(new Error("Network error"));

    // Act
    renderCatalog();

    // Assert
    await waitFor(() =>
      expect(screen.getByText("No se pudo cargar el catálogo.")).toBeInTheDocument(),
    );
  });

  it("filtra los productos por término de búsqueda en tiempo real", async () => {
    // Arrange
    vi.mocked(listProducts).mockResolvedValue([
      makeProduct({ id: 1, name: "Labial Rosa" }),
      makeProduct({ id: 2, name: "Sérum Vitamina C" }),
    ]);
    renderCatalog();
    await waitFor(() => expect(screen.getByText("Labial Rosa")).toBeInTheDocument());

    // Act – escribir en el buscador del StoreHeader
    fireEvent.change(
      screen.getByPlaceholderText("Buscar productos, marcas y más…"),
      { target: { value: "sérum" } },
    );

    // Assert
    expect(screen.queryByText("Labial Rosa")).not.toBeInTheDocument();
    expect(screen.getByText("Sérum Vitamina C")).toBeInTheDocument();
  });

  it("muestra mensaje cuando ningún producto coincide con los filtros", async () => {
    // Arrange
    vi.mocked(listProducts).mockResolvedValue([
      makeProduct({ id: 1, name: "Labial Rosa" }),
    ]);
    renderCatalog();
    await waitFor(() => expect(screen.getByText("Labial Rosa")).toBeInTheDocument());

    // Act – buscar algo que no existe
    fireEvent.change(
      screen.getByPlaceholderText("Buscar productos, marcas y más…"),
      { target: { value: "zzz-no-existe" } },
    );

    // Assert
    expect(
      screen.getByText("No se encontraron productos con esos criterios."),
    ).toBeInTheDocument();
  });
});
