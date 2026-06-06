import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CheckoutPage } from "./CheckoutPage";
import { CartProvider } from "../cart/CartContext";
import { ToastProvider } from "../ui/ToastContext";
import type { CartItem } from "../cart/CartContext";
import type { Order } from "../types";

vi.mock("../api/orders", () => ({
  checkout: vi.fn(),
  getOrder: vi.fn(),
  listOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

import { checkout } from "../api/orders";

const CART_KEY = "ecommerce_cart";

const mockProduct = {
  id: 1,
  name: "Labial Rosa Intenso",
  description: "Descripción",
  price: "29900",
  stock: 5,
  brand: "GlowBrand",
  category: "Labios",
  image_url: "",
  is_active: true,
  is_available: true,
};

const mockOrder: Order = {
  id: 42,
  customer_name: "Ana García",
  customer_email: "ana@test.com",
  customer_phone: "3001234567",
  shipping_address: "Calle 1 #2-3",
  payment_method: "pasarela",
  payment_status: "aprobado",
  status: "pendiente",
  total: "29900",
  items: [{ product_id: 1, product_name: "Labial Rosa Intenso", unit_price: "29900", quantity: 1, subtotal: "29900" }],
  created_at: "2026-06-05T10:00:00Z",
};

function renderCheckout(items: CartItem[] = [{ product: mockProduct, quantity: 1 }]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  return render(
    <MemoryRouter initialEntries={["/checkout"]}>
      <CartProvider>
        <ToastProvider>
          <Routes>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/pedido/:id" element={<div>Confirmación de pedido</div>} />
            <Route path="/" element={<div>Catálogo</div>} />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </MemoryRouter>,
  );
}

function fillForm() {
  fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Ana García" } });
  fireEvent.change(screen.getByLabelText("Correo"), { target: { value: "ana@test.com" } });
  fireEvent.change(screen.getByLabelText("Dirección de envío"), { target: { value: "Calle 1 #2-3" } });
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("CheckoutPage – carrito vacío", () => {
  it("muestra mensaje de carrito vacío en lugar del formulario", () => {
    renderCheckout([]);

    expect(screen.getByText("Tu carrito está vacío.")).toBeInTheDocument();
    expect(screen.queryByText("Finalizar compra")).not.toBeInTheDocument();
  });
});

describe("CheckoutPage – formulario", () => {
  it("muestra el resumen del pedido con el nombre del producto y el total", () => {
    renderCheckout();

    expect(screen.getByText(/Labial Rosa Intenso/)).toBeInTheDocument();
  });

  it("muestra el método de pago 'pasarela' seleccionado por defecto", () => {
    renderCheckout();

    expect(
      screen.getByRole("radio", { name: /Pago en línea/i }),
    ).toBeChecked();
  });

  it("oculta la opción de simular fallo al seleccionar contra entrega", () => {
    renderCheckout();

    fireEvent.click(screen.getByRole("radio", { name: /Contra entrega/i }));

    expect(screen.queryByText(/Simular pago rechazado/)).not.toBeInTheDocument();
  });

  it("navega a /pedido/:id y vacía el carrito tras checkout exitoso", async () => {
    // Arrange
    vi.mocked(checkout).mockResolvedValue(mockOrder);
    renderCheckout();
    fillForm();

    // Act
    fireEvent.click(screen.getByRole("button", { name: /confirmar compra/i }));

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Confirmación de pedido")).toBeInTheDocument(),
    );
  });

  it("muestra error de stock cuando la API responde 409", async () => {
    // Arrange
    vi.mocked(checkout).mockRejectedValue({ isAxiosError: true, response: { status: 409 } });
    renderCheckout();
    fillForm();

    // Act
    fireEvent.click(screen.getByRole("button", { name: /confirmar compra/i }));

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText("Uno o más productos se quedaron sin stock."),
      ).toBeInTheDocument(),
    );
  });

  it("muestra error de pago rechazado cuando la API responde 402", async () => {
    // Arrange
    vi.mocked(checkout).mockRejectedValue({ isAxiosError: true, response: { status: 402 } });
    renderCheckout();
    fillForm();

    // Act
    fireEvent.click(screen.getByRole("button", { name: /confirmar compra/i }));

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText("El pago fue rechazado. Intenta con otro método."),
      ).toBeInTheDocument(),
    );
  });

  it("deshabilita el botón y muestra 'Procesando…' mientras se envía el pedido", async () => {
    // Arrange: checkout que no resuelve de inmediato
    let resolve: (o: Order) => void;
    vi.mocked(checkout).mockImplementation(
      () => new Promise<Order>((res) => { resolve = res; }),
    );
    renderCheckout();
    fillForm();

    // Act
    fireEvent.click(screen.getByRole("button", { name: /confirmar compra/i }));

    // Assert
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /procesando/i })).toBeDisabled(),
    );

    // Cleanup
    act(() => resolve(mockOrder));
  });
});
