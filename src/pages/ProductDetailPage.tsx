import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/products";
import { PublicLayout } from "../components/PublicLayout";
import type { Product } from "../types";
import { formatCOP } from "../utils/format";

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pid = Number(id);
    if (!pid) {
      setError("Producto no válido.");
      setLoading(false);
      return;
    }
    getProduct(pid)
      .then(setProduct)
      .catch(() => setError("Producto no encontrado."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PublicLayout>
      <Link to="/" className="mb-6 inline-block text-sm text-slate-500 hover:text-pink-600">
        ← Volver al catálogo
      </Link>

      {loading ? (
        <p className="text-slate-500">Cargando…</p>
      ) : error || !product ? (
        <p className="rounded-lg bg-white p-8 text-center text-slate-500 shadow-sm">
          {error ?? "Producto no encontrado."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-300">
                Sin imagen
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-slate-400">{product.brand || "Sin marca"}</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-800">{product.name}</h1>
            {product.category && (
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {product.category}
              </span>
            )}

            <p className="mt-4 text-2xl font-semibold text-pink-600">
              {formatCOP(product.price)}
            </p>

            <div className="mt-4">
              {product.is_available ? (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  Disponible ({product.stock} en stock)
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
                  Agotado
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-6 leading-relaxed text-slate-600">{product.description}</p>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
