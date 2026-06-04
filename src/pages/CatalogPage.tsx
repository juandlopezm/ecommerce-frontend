import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { listProducts } from "../api/products";
import { CategoryCircles } from "../components/CategoryCircles";
import { FilterSidebar } from "../components/FilterSidebar";
import { HeroBanner } from "../components/HeroBanner";
import { ProductCard } from "../components/ProductCard";
import { PublicLayout } from "../components/PublicLayout";
import type { Product } from "../types";

interface Counted {
  name: string;
  count: number;
}

function countBy(items: Product[], key: "category" | "brand"): Counted[] {
  const map = new Map<string, number>();
  for (const p of items) {
    const value = p[key];
    if (!value) continue;
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function CatalogPage() {
  const [params] = useSearchParams();
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [priceBound, setPriceBound] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    listProducts()
      .then((data) => {
        const active = data.filter((p) => p.is_active);
        setAll(active);
        const top = Math.max(0, ...active.map((p) => Number(p.price)));
        const bound = Math.ceil(top / 1000) * 1000 || 1000;
        setPriceBound(bound);
        setMaxPrice(bound);
      })
      .catch(() => setError("No se pudo cargar el catálogo."))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => countBy(all, "category"), [all]);
  const brandsCounted = useMemo(() => countBy(all, "brand"), [all]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter((p) => {
      if (category && p.category !== category) return false;
      if (brands.length > 0 && !brands.includes(p.brand)) return false;
      if (Number(p.price) > maxPrice) return false;
      if (term && !p.name.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [all, category, brands, maxPrice, search]);

  function toggleBrand(brand: string) {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  }

  function resetFilters() {
    setSearch("");
    setCategory("");
    setBrands([]);
    setMaxPrice(priceBound);
  }

  return (
    <PublicLayout search={search} onSearchChange={setSearch}>
      <div className="flex gap-6">
        <div className="hidden lg:block">
          <FilterSidebar
            categories={categories}
            selectedCategory={category}
            onSelectCategory={setCategory}
            brands={brandsCounted}
            selectedBrands={brands}
            onToggleBrand={toggleBrand}
            priceBound={priceBound}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-8">
          <HeroBanner />

          <CategoryCircles
            categories={categories.map((c) => c.name)}
            selected={category}
            onSelect={setCategory}
          />

          <section id="productos">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Productos para ti ♡</h2>
              <button
                onClick={resetFilters}
                className="text-sm font-medium text-pink-600 hover:underline"
              >
                Ver todos →
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            {loading ? (
              <p className="text-slate-500">Cargando…</p>
            ) : filtered.length === 0 ? (
              <p className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
                No se encontraron productos con esos criterios.
              </p>
            ) : (
              <div className="animate-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
