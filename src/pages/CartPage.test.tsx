import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CartPage } from "./CartPage";
import { CartProvider } from "../cart/CartContext";
import { ToastProvider } from "../ui/ToastContext";
import type { CartItem } from "../cart/CartContext";

const CART_KEY = "ecommerce_cart";

const mockProduct = {
  id: 1,
  name: "Labial Rosa Intenso",
  description: "Labial de larga duración",
  price: "29900",
  stock: 5,
  brand: "GlowBrand",
  category: "Labios",
  image_url: "",
  is_active: true,
  is_available: true,
};

function renderCartPage(items: CartItem[] = []) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return render(
    <MemoryRouter initialEntries={["/carrito"]}>
      <CartProvider>
        <ToastProvider>
          <Routes>
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/" element={<div>Catálogo</div>} />
            <Route path="/checkout" element={<div>Checkout</div>} />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());

describe("CartPage – carrito vacío", () => {
  it("muestra mensaje de carrito vacío y enlace al catálogo", () => {
    renderCartPage([]);

    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explorar productos/i })).toBeInTheDocument();
  });
});

describe("CartPage – carrito con ítems", () => {
  const twoItems: CartItem[] = [
    { product: mockProduct, quantity: 2 },
    {
      product: { ...mockProduct, id: 2, name: "Sérum Vitamina C", price: "59900" },
      quantity: 1,
    },
  ];

  it("muestra el nombre del producto y la cantidad en el encabezado", () => {
    renderCartPage([{ product: mockProduct, quantity: 2 }]);

    expect(screen.getByText("Labial Rosa Intenso")).toBeInTheDocument();
    expect(screen.getByText(/2 ítems/)).toBeInTheDocument();
  });

  it("el botón Aumentar incrementa la cantidad del producto", () => {
    renderCartPage([{ product: mockProduct, quantity: 1 }]);

    fireEvent.click(screen.getByRole("button", { name: /aumentar/i }));

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("el botón Disminuir reduce la cantidad del producto", () => {
    renderCartPage([{ product: mockProduct, quantity: 3 }]);

    fireEvent.click(screen.getByRole("button", { name: /disminuir/i }));

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("el botón Aumentar está deshabilitado cuando la cantidad alcanza el stock", () => {
    // stock = 5, quantity = 5 → botón Aumentar deshabilitado
    renderCartPage([{ product: mockProduct, quantity: 5 }]);

    expect(screen.getByRole("button", { name: /aumentar/i })).toBeDisabled();
  });

  it("el botón Eliminar quita el producto del carrito", () => {
    renderCartPage(twoItems);

    // Eliminar el primer producto
    const removeButtons = screen.getAllByRole("button", { name: /eliminar/i });
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText("Labial Rosa Intenso")).not.toBeInTheDocument();
    expect(screen.getByText("Sérum Vitamina C")).toBeInTheDocument();
  });

  it("Vaciar carrito elimina todos los ítems y muestra estado vacío", () => {
    renderCartPage(twoItems);

    fireEvent.click(screen.getByText("Vaciar carrito"));

    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
  });

  it("muestra el enlace Finalizar compra que apunta a /checkout", () => {
    renderCartPage([{ product: mockProduct, quantity: 1 }]);

    const link = screen.getByRole("link", { name: /finalizar compra/i });
    expect(link).toHaveAttribute("href", "/checkout");
  });
});
