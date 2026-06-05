import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { OrderConfirmationPage } from "./OrderConfirmationPage";
import { CartProvider } from "../cart/CartContext";
import { ToastProvider } from "../ui/ToastContext";
import type { Order } from "../types";

vi.mock("../api/orders", () => ({
  checkout: vi.fn(),
  getOrder: vi.fn(),
  listOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
}));

import { getOrder } from "../api/orders";

const mockOrder: Order = {
  id: 42,
  customer_name: "Ana García",
  customer_email: "ana@test.com",
  customer_phone: "3001234567",
  shipping_address: "Calle 1 #2-3, Bogotá",
  payment_method: "pasarela",
  payment_status: "aprobado",
  status: "pendiente",
  total: "59800",
  items: [
    { product_id: 1, product_name: "Labial Rosa", unit_price: "29900", quantity: 2, subtotal: "59800" },
  ],
  created_at: "2026-06-05T10:00:00Z",
};

function renderConfirmation(orderId: string) {
  return render(
    <MemoryRouter initialEntries={[`/pedido/${orderId}`]}>
      <CartProvider>
        <ToastProvider>
          <Routes>
            <Route path="/pedido/:id" element={<OrderConfirmationPage />} />
          </Routes>
        </ToastProvider>
      </CartProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => vi.clearAllMocks());

describe("OrderConfirmationPage", () => {
  it("muestra los datos del pedido tras carga exitosa", async () => {
    // Arrange
    vi.mocked(getOrder).mockResolvedValue(mockOrder);

    // Act
    renderConfirmation("42");

    // Assert
    await waitFor(() =>
      expect(screen.getByText(/#42/)).toBeInTheDocument(),
    );
    expect(screen.getByText("Ana García")).toBeInTheDocument();
    expect(screen.getByText("Calle 1 #2-3, Bogotá")).toBeInTheDocument();
  });

  it("muestra el método de pago con etiqueta legible", async () => {
    // Arrange
    vi.mocked(getOrder).mockResolvedValue(mockOrder);

    // Act
    renderConfirmation("42");

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Pago en línea")).toBeInTheDocument(),
    );
  });

  it("muestra los ítems del pedido con cantidad y nombre", async () => {
    // Arrange
    vi.mocked(getOrder).mockResolvedValue(mockOrder);

    // Act
    renderConfirmation("42");

    // Assert
    await waitFor(() =>
      expect(screen.getByText(/2 × Labial Rosa/)).toBeInTheDocument(),
    );
  });

  it("muestra error cuando el pedido no se encuentra en la API", async () => {
    // Arrange
    vi.mocked(getOrder).mockRejectedValue(new Error("404 Not found"));

    // Act
    renderConfirmation("99");

    // Assert
    await waitFor(() =>
      expect(screen.getByText("No se encontró el pedido.")).toBeInTheDocument(),
    );
  });

  it("muestra error cuando el id del parámetro no es un número válido", async () => {
    // Act
    renderConfirmation("no-es-un-id");

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Pedido no válido.")).toBeInTheDocument(),
    );
    expect(getOrder).not.toHaveBeenCalled();
  });
});
