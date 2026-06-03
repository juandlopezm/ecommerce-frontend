import { Link } from "react-router-dom";
import type { Product } from "../types";
import { formatCOP } from "../utils/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/producto/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
    >
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
        <h3 className="font-medium text-slate-800">{product.name}</h3>
        <p className="text-xs text-slate-400">{product.brand || "—"}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold">{formatCOP(product.price)}</span>
          {product.is_available ? (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
              Disponible
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
              Agotado
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
