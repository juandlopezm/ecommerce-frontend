import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProductDetailPage } from "./ProductDetailPage";
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
vi.mock("../components/RelatedProducts", () => ({
  RelatedProducts: () => null,
}));

import { getProduct } from "../api/products";

const mockProduct: Product = {
  id: 7,
  name: "Sérum Vitamina C Premium",
  description: "Ilumina y unifica el tono de la piel",
  price: "89900",
  stock: 8,
  brand: "GlowLab",
  category: "Piel",
  image_url: "",
  is_active: true,
  is_available: true,
};

function renderDetail(productId: string) {
  return render(
    <MemoryRouter initialEntries={[`/producto/${productId}`]}>
      <CartProvider>
        <ToastProvider>
          <Routes>
            <Route path="/producto/:id" element={<ProductDetailPage />} />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("ProductDetailPage", () => {
  it("muestra el nombre y la descripción del producto tras la carga", async () => {
    // Arrange
    vi.mocked(getProduct).mockResolvedValue(mockProduct);

    // Act
    renderDetail("7");

    // Assert – el nombre puede aparecer en breadcrumb y heading; verificamos el heading principal
    await waitFor(() =>
      expect(screen.getAllByText("Sérum Vitamina C Premium").length).toBeGreaterThan(0),
    );
    expect(screen.getByText("Ilumina y unifica el tono de la piel")).toBeInTheDocument();
  });

  it("el botón 'Agregar al carrito' agrega el producto y muestra toast", async () => {
    // Arrange
    vi.mocked(getProduct).mockResolvedValue(mockProduct);
    renderDetail("7");
    await waitFor(() =>
      expect(screen.getAllByText("Sérum Vitamina C Premium").length).toBeGreaterThan(0),
    );

    // Act
    fireEvent.click(screen.getByRole("button", { name: /agregar al carrito/i }));

    // Assert – el toast con el nombre del producto aparece
    await waitFor(() =>
      expect(
        screen.getByText(/Sérum Vitamina C Premium agregado al carrito/),
      ).toBeInTheDocument(),
    );
  });

  it("el botón dice 'Agotado' y está deshabilitado cuando el producto no está disponible", async () => {
    // Arrange
    vi.mocked(getProduct).mockResolvedValue({ ...mockProduct, is_available: false });

    // Act
    renderDetail("7");

    // Assert
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /agotado/i })).toBeDisabled(),
    );
  });

  it("muestra error cuando el producto no existe en la API", async () => {
    // Arrange
    vi.mocked(getProduct).mockRejectedValue(new Error("404 Not found"));

    // Act
    renderDetail("999");

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Producto no encontrado.")).toBeInTheDocument(),
    );
  });

  it("muestra error inmediato cuando el id del parámetro no es válido", async () => {
    // Act
    renderDetail("abc");

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Producto no válido.")).toBeInTheDocument(),
    );
    expect(getProduct).not.toHaveBeenCalled();
  });

  it("la navegación de tabs cambia el contenido mostrado", async () => {
    // Arrange
    vi.mocked(getProduct).mockResolvedValue(mockProduct);
    renderDetail("7");
    await waitFor(() =>
      expect(screen.getAllByText("Sérum Vitamina C Premium").length).toBeGreaterThan(0),
    );

    // Act – navegar a la pestaña Ingredientes
    fireEvent.click(screen.getByRole("button", { name: "Ingredientes" }));

    // Assert
    expect(
      screen.getByText(/La información de ingredientes estará disponible/),
    ).toBeInTheDocument();
  });
});
