import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrder } from "../api/orders";
import { PublicLayout } from "../components/PublicLayout";
import type { Order } from "../types";
import { formatCOP } from "../utils/format";

const PAYMENT_LABEL: Record<string, string> = {
  pasarela: "Pago en línea",
  contra_entrega: "Contra entrega / transferencia",
};

export function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const oid = Number(id);
    if (!oid) {
      setError("Pedido no válido.");
      setLoading(false);
      return;
    }
    getOrder(oid)
      .then(setOrder)
      .catch(() => setError("No se encontró el pedido."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <p className="text-slate-500">Cargando…</p>
      </PublicLayout>
    );
  }

  if (error || !order) {
    return (
      <PublicLayout>
        <p className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          {error ?? "Pedido no encontrado."}
        </p>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="animate-fade-in-up mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-800">¡Gracias por tu compra!</h1>
          <p className="mt-1 text-slate-500">
            Tu pedido <span className="font-semibold text-pink-600">#{order.id}</span> fue registrado.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Estado: <strong>{order.status}</strong>
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Pago: <strong>{order.payment_status}</strong>
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {PAYMENT_LABEL[order.payment_method] ?? order.payment_method}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Resumen</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((it) => (
              <li key={it.product_id} className="flex justify-between text-slate-600">
                <span>
                  {it.quantity} × {it.product_name}
                </span>
                <span>{formatCOP(it.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatCOP(order.total)}</span>
          </div>

          <div className="mt-6 text-sm text-slate-600">
            <p className="font-semibold text-slate-700">Envío</p>
            <p>{order.customer_name}</p>
            <p>{order.shipping_address}</p>
            <p>{order.customer_email}</p>
          </div>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm font-medium text-pink-600 hover:underline"
        >
          ← Seguir comprando
        </Link>
      </div>
    </PublicLayout>
  );
}
