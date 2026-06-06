import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { OrdersAdminPage } from "./OrdersAdminPage";
import { ToastProvider } from "../ui/ToastContext";
import type { Order } from "../types";

vi.mock("../api/orders", () => ({
  listOrders: vi.fn(),
  updateOrderStatus: vi.fn(),
  checkout: vi.fn(),
  getOrder: vi.fn(),
}));
vi.mock("../auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: 1, email: "admin@test.com", full_name: "Admin Test", role: "administrador", is_active: true },
    logout: vi.fn(),
    login: vi.fn(),
  })),
}));

import { listOrders, updateOrderStatus } from "../api/orders";

const mockOrder: Order = {
  id: 10,
  customer_name: "Carlos López",
  customer_email: "carlos@test.com",
  customer_phone: "3009876543",
  shipping_address: "Av. El Dorado 123",
  payment_method: "pasarela",
  payment_status: "aprobado",
  status: "pendiente",
  total: "119800",
  items: [
    { product_id: 1, product_name: "Labial Rosa", unit_price: "29900", quantity: 4, subtotal: "119800" },
  ],
  created_at: "2026-06-05T08:00:00Z",
};

function renderOrders() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <OrdersAdminPage />
      </ToastProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => vi.clearAllMocks());

describe("OrdersAdminPage", () => {
  it("muestra 'Cargando…' mientras se obtienen los pedidos", () => {
    vi.mocked(listOrders).mockImplementation(() => new Promise(() => {}));

    renderOrders();

    expect(screen.getByText("Cargando…")).toBeInTheDocument();
  });

  it("muestra mensaje de lista vacía cuando no hay pedidos", async () => {
    // Arrange
    vi.mocked(listOrders).mockResolvedValue([]);

    // Act
    renderOrders();

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Aún no hay pedidos.")).toBeInTheDocument(),
    );
  });

  it("muestra el nombre del cliente y el estado tras la carga", async () => {
    // Arrange
    vi.mocked(listOrders).mockResolvedValue([mockOrder]);

    // Act
    renderOrders();

    // Assert
    await waitFor(() =>
      expect(screen.getByText("Carlos López")).toBeInTheDocument(),
    );
    expect(screen.getByDisplayValue("pendiente")).toBeInTheDocument();
  });

  it("muestra error cuando listOrders falla", async () => {
    // Arrange
    vi.mocked(listOrders).mockRejectedValue(new Error("500"));

    // Act
    renderOrders();

    // Assert
    await waitFor(() =>
      expect(screen.getByText("No se pudieron cargar los pedidos.")).toBeInTheDocument(),
    );
  });

  it("expande el detalle del pedido al hacer clic en 'Ver detalle'", async () => {
    // Arrange
    vi.mocked(listOrders).mockResolvedValue([mockOrder]);

    // Act
    renderOrders();
    await waitFor(() => screen.getByText("Ver detalle"));
    fireEvent.click(screen.getByText("Ver detalle"));

    // Assert – los ítems del pedido son visibles
    await waitFor(() =>
      expect(screen.getByText(/4 × Labial Rosa/)).toBeInTheDocument(),
    );
    expect(screen.getByText("Av. El Dorado 123")).toBeInTheDocument();
  });

  it("llama a updateOrderStatus al cambiar el select de estado y muestra toast", async () => {
    // Arrange
    const updatedOrder: Order = { ...mockOrder, status: "confirmado" };
    vi.mocked(listOrders).mockResolvedValue([mockOrder]);
    vi.mocked(updateOrderStatus).mockResolvedValue(updatedOrder);

    // Act
    renderOrders();
    await waitFor(() => screen.getByDisplayValue("pendiente"));
    fireEvent.change(screen.getByDisplayValue("pendiente"), {
      target: { value: "confirmado" },
    });

    // Assert
    await waitFor(() =>
      expect(updateOrderStatus).toHaveBeenCalledWith(10, "confirmado"),
    );
    await waitFor(() =>
      expect(screen.getByText(/Pedido #10/)).toBeInTheDocument(),
    );
  });
});
