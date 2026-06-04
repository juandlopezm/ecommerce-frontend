import { Fragment, useEffect, useState } from "react";
import { listOrders, updateOrderStatus } from "../api/orders";
import { Layout } from "../components/Layout";
import type { Order, OrderStatus } from "../types";
import { useToast } from "../ui/ToastContext";
import { formatCOP } from "../utils/format";

const STATUSES: OrderStatus[] = ["pendiente", "confirmado", "enviado", "cancelado"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  confirmado: "bg-blue-100 text-blue-700",
  enviado: "bg-green-100 text-green-700",
  cancelado: "bg-red-100 text-red-700",
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  pasarela: "Pasarela",
  contra_entrega: "Contra entrega",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function OrdersAdminPage() {
  const { show } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setOrders(await listOrders());
    } catch {
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(order: Order, status: OrderStatus) {
    if (status === order.status) return;
    setUpdatingId(order.id);
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      show(`Pedido #${order.id} → ${status}`);
    } catch {
      setError("No se pudo actualizar el estado del pedido.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Layout>
      <h2 className="mb-6 text-xl font-bold text-slate-800">Pedidos</h2>

      {error && (
        <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="text-slate-500">Cargando…</p>
      ) : orders.length === 0 ? (
        <p className="rounded-lg bg-white p-8 text-center text-slate-500 shadow-sm">
          Aún no hay pedidos.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">#{o.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{o.customer_name}</div>
                      <div className="text-xs text-slate-400">{o.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3">
                      <div>{PAYMENT_METHOD_LABEL[o.payment_method] ?? o.payment_method}</div>
                      <div className="text-xs text-slate-400">{o.payment_status}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCOP(o.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        disabled={updatingId === o.id}
                        onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                        className={`rounded-full px-3 py-1 text-xs font-medium outline-none ${STATUS_STYLES[o.status]}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                        className="text-sm text-pink-600 hover:underline"
                      >
                        {expandedId === o.id ? "Ocultar" : "Ver detalle"}
                      </button>
                    </td>
                  </tr>
                  {expandedId === o.id && (
                    <tr className="bg-slate-50">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <p className="mb-1 font-semibold text-slate-700">Envío</p>
                            <p className="text-slate-600">{o.customer_name}</p>
                            <p className="text-slate-600">{o.shipping_address}</p>
                            <p className="text-slate-600">{o.customer_phone || "Sin teléfono"}</p>
                          </div>
                          <div>
                            <p className="mb-1 font-semibold text-slate-700">Productos</p>
                            <ul className="space-y-1">
                              {o.items.map((it) => (
                                <li key={it.product_id} className="flex justify-between text-slate-600">
                                  <span>
                                    {it.quantity} × {it.product_name}
                                  </span>
                                  <span>{formatCOP(it.subtotal)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
