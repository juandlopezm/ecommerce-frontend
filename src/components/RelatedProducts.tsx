import { useEffect, useState } from "react";
import { listProducts } from "../api/products";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

interface Props {
  category: string;
  excludeId: number;
}

/** "También te puede gustar": productos reales de la misma categoría. */
export function RelatedProducts({ category, excludeId }: Props) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    listProducts()
      .then((all) =>
        setItems(
          all
            .filter(
              (p) =>
                p.is_active &&
                p.id !== excludeId &&
                (category ? p.category === category : true),
            )
            .slice(0, 5),
        ),
      )
      .catch(() => setItems([]));
  }, [category, excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold text-slate-800">También te puede gustar</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
