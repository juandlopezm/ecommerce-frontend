import type { CheckoutPayload, Order, OrderStatus } from "../types";
import { api } from "./client";

/** Procesa la compra y genera el pedido (invitado o autenticado). */
export async function checkout(payload: CheckoutPayload): Promise<Order> {
  const { data } = await api.post<Order>("/orders", payload);
  return data;
}

/** Consulta un pedido por su id (confirmación / seguimiento). */
export async function getOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}

/** Lista todos los pedidos (requiere token de administrador). */
export async function listOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/admin/orders");
  return data;
}

/** Cambia el estado de un pedido (admin). Al cancelar, el backend restaura el stock. */
export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const { data } = await api.patch<Order>(`/admin/orders/${id}/status`, { status });
  return data;
}
