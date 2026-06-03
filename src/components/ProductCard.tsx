import { type MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatCOP } from "../utils/format";

/** Tarjeta de producto estilo portada. El corazón y el botón "+" son decorativos (sin backend). */
export function ProductCard({ product }: { product: Product }) {
  function decorative(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
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
            onClick={decorative}
            title="Próximamente"
            aria-label="Agregar al carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-lg font-bold text-white hover:bg-pink-700"
          >
            +
          </button>
        </div>
      </div>
    </Link>
  );
}
