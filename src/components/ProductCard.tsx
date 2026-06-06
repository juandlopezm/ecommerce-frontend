import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import type { Product } from "../types";
import { useToast } from "../ui/ToastContext";
import { formatCOP } from "../utils/format";

/** Tarjeta de producto estilo portada. El botón "+" agrega al carrito; el corazón es decorativo. */
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { show } = useToast();

  function decorative(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function addToCart(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add(product, 1);
    show(`${product.name} agregado al carrito`);
  }

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <button
        onClick={decorative}
        title="Próximamente"
        aria-label="Agregar a favoritos"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow hover:text-pink-600"
      >
        ♡
      </button>

      <div className="aspect-square w-full overflow-hidden bg-slate-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-300">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-800">{product.name}</h3>
        <p className="mt-0.5 text-xs text-slate-400">{product.brand || "—"}</p>

        {/* Valoración decorativa */}
        <div className="mt-1 text-xs text-pink-500">
          ★★★★<span className="text-slate-300">★</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <span className="font-bold text-slate-800">{formatCOP(product.price)}</span>
            {!product.is_available && (
              <span className="ml-2 text-xs font-medium text-amber-600">Agotado</span>
            )}
          </div>
          <button
            onClick={addToCart}
            disabled={!product.is_available}
            title={product.is_available ? "Agregar al carrito" : "Agotado"}
            aria-label={`Agregar ${product.name} al carrito`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-lg font-bold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>
    </Link>
  );
}
