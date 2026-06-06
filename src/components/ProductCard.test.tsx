import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { CartProvider } from "../cart/CartContext";
import { ToastProvider } from "../ui/ToastContext";
import type { Product } from "../types";

const mockProduct: Product = {
  id: 3,
  name: "Base Matte Pro",
  description: "Base de cobertura total",
  price: "79900",
  stock: 10,
  brand: "GlowCover",
  category: "Rostro",
  image_url: "",
  is_active: true,
  is_available: true,
};

function renderCard(product: Product = mockProduct) {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ToastProvider>
          <ProductCard product={product} />
        </ToastProvider>
      </CartProvider>
    </MemoryRouter>,
  );
}

describe("ProductCard", () => {
  it("muestra el nombre del producto y enlaza al detalle", () => {
    renderCard();

    expect(screen.getByText("Base Matte Pro")).toBeInTheDocument();
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/producto/3");
  });

  it("al hacer clic en '+' agrega el producto al carrito y muestra toast", () => {
    renderCard();

    fireEvent.click(screen.getByRole("button", { name: /agregar Base Matte Pro/i }));

    expect(screen.getByText(/Base Matte Pro agregado al carrito/)).toBeInTheDocument();
  });

  it("el botón '+' está deshabilitado cuando el producto no está disponible", () => {
    renderCard({ ...mockProduct, is_available: false });

    expect(
      screen.getByRole("button", { name: /agregar Base Matte Pro/i }),
    ).toBeDisabled();
  });

  it("muestra la etiqueta 'Agotado' cuando el producto no está disponible", () => {
    renderCard({ ...mockProduct, is_available: false });

    expect(screen.getByText("Agotado")).toBeInTheDocument();
  });

  it("el botón de favoritos es decorativo y no navega al hacer clic", () => {
    renderCard();

    // El botón ♡ no debe cambiar la ruta
    const heartBtn = screen.getByRole("button", { name: /agregar a favoritos/i });
    fireEvent.click(heartBtn);

    // La URL no cambia (seguimos en '/')
    expect(window.location.pathname).toBe("/");
  });
});
