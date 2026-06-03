import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../api/products";
import { ProductCard } from "../components/ProductCard";
import { PublicLayout } from "../components/PublicLayout";
import type { Product } from "../types";

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort();
}

export function CatalogPage() {
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  useEffect(() => {
    listProducts()
      .then((data) => setAll(data.filter((p) => p.is_active)))
      .catch(() => setError("No se pudo cargar el catálogo."))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => unique(all.map((p) => p.category)), [all]);
  const brands = useMemo(() => unique(all.map((p) => p.brand)), [all]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter((p) => {
      if (category && p.category !== category) return false;
      if (brand && p.brand !== brand) return false;
      if (term && !p.name.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [all, search, category, brand]);

  const select =
    "rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-pink-500";

  return (
    <PublicLayout>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Catálogo</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre…"
          className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-pink-500"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={select}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className={select}>
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="text-slate-500">Cargando…</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-lg bg-white p-8 text-center text-slate-500 shadow-sm">
          No se encontraron productos con esos criterios.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </PublicLayout>
  );
}
