import axios from "axios";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkout } from "../api/orders";
import { useCart } from "../cart/CartContext";
import { PublicLayout } from "../components/PublicLayout";
import type { PaymentMethod } from "../types";
import { formatCOP } from "../utils/format";

function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 409) return "Uno o más productos se quedaron sin stock.";
    if (err.response?.status === 402) return "El pago fue rechazado. Intenta con otro método.";
    if (err.response?.status === 404) return "Un producto del carrito ya no está disponible.";
  }
  return "No se pudo procesar la compra. Inténtalo de nuevo.";
}

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("pasarela");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="text-lg text-slate-600">Tu carrito está vacío.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full bg-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-pink-700"
          >
            Explorar productos
          </Link>
        </div>
      </PublicLayout>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const order = await checkout({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        payment_method: method,
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        simulate_payment_failure: simulateFailure,
      });
      clear();
      navigate(`/pedido/${order.id}`, { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const input =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-pink-500";

  return (
    <PublicLayout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Finalizar compra</h1>

      {error && (
        <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Datos de envío + pago */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">Datos de envío</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="mb-1 block text-sm font-medium">
                  Nombre completo
                </label>
                <input
                  id="name"
                  className={input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  className={input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                  Teléfono
                </label>
                <input
                  id="phone"
                  className={input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1 block text-sm font-medium">
                  Dirección de envío
                </label>
                <textarea
                  id="address"
                  className={input}
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">Método de pago</h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:border-pink-300">
                <input
                  type="radio"
                  name="payment"
                  checked={method === "pasarela"}
                  onChange={() => setMethod("pasarela")}
                  className="accent-pink-600"
                />
                <span>
                  <span className="block text-sm font-medium">Pago en línea (pasarela)</span>
                  <span className="block text-xs text-slate-400">Procesado en modo sandbox</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:border-pink-300">
                <input
                  type="radio"
                  name="payment"
                  checked={method === "contra_entrega"}
                  onChange={() => setMethod("contra_entrega")}
                  className="accent-pink-600"
                />
                <span>
                  <span className="block text-sm font-medium">Contra entrega / transferencia</span>
                  <span className="block text-xs text-slate-400">Queda pendiente de pago</span>
                </span>
              </label>
            </div>

            {method === "pasarela" && (
              <label className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="accent-pink-600"
                />
                Simular pago rechazado (prueba)
              </label>
            )}
          </section>
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Resumen del pedido</h2>
          <ul className="space-y-2 text-sm">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between text-slate-600">
                <span className="min-w-0 truncate pr-2">
                  {quantity} × {product.name}
                </span>
                <span>{formatCOP(Number(product.price) * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatCOP(subtotal)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-pink-600 py-3 font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
          >
            {submitting ? "Procesando…" : "Confirmar compra"}
          </button>
          <Link
            to="/carrito"
            className="mt-3 block text-center text-sm text-slate-500 hover:text-pink-600"
          >
            ← Volver al carrito
          </Link>
        </aside>
      </form>
    </PublicLayout>
  );
}
