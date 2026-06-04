import type { Order, OrderStatus } from "../types";
import { api } from "./client";

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
