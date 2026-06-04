import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import { PublicLayout } from "../components/PublicLayout";
import { formatCOP } from "../utils/format";

export function CartPage() {
  const { items, count, subtotal, updateQty, remove, clear } = useCart();

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

  return (
    <PublicLayout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        Tu carrito <span className="text-base font-normal text-slate-400">({count} ítems)</span>
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-300">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Link to={`/producto/${product.id}`} className="font-medium text-slate-800 hover:text-pink-600">
                  {product.name}
                </Link>
                <p className="text-xs text-slate-400">{product.brand || "—"}</p>
                <p className="mt-1 text-sm font-semibold">{formatCOP(product.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(product.id, quantity - 1)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-lg hover:bg-slate-200"
                  aria-label="Disminuir"
                >
                  −
                </button>
                <span className="w-6 text-center">{quantity}</span>
                <button
                  onClick={() => updateQty(product.id, quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="h-8 w-8 rounded-full bg-slate-100 text-lg hover:bg-slate-200 disabled:opacity-40"
                  aria-label="Aumentar"
                >
                  +
                </button>
              </div>

              <div className="w-24 text-right font-semibold">
                {formatCOP(Number(product.price) * quantity)}
              </div>

              <button
                onClick={() => remove(product.id)}
                className="text-sm text-red-500 hover:text-red-700"
                aria-label="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}

          <button onClick={clear} className="text-sm text-slate-500 hover:text-red-600">
            Vaciar carrito
          </button>
        </div>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Resumen</h2>
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal ({count} ítems)</span>
            <span>{formatCOP(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-slate-600">
            <span>Envío</span>
            <span>Se calcula en el pago</span>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatCOP(subtotal)}</span>
          </div>
          <button
            disabled
            title="Próximamente"
            className="mt-6 w-full cursor-not-allowed rounded-full bg-pink-600 py-3 font-semibold text-white opacity-60"
          >
            Finalizar compra (próximamente)
          </button>
          <Link
            to="/"
            className="mt-3 block text-center text-sm text-slate-500 hover:text-pink-600"
          >
            ← Seguir comprando
          </Link>
        </aside>
      </div>
    </PublicLayout>
  );
}
