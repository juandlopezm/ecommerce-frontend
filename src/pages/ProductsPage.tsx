import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../api/products";
import { Layout } from "../components/Layout";
import { ProductForm } from "../components/ProductForm";
import { ProductTable } from "../components/ProductTable";
import type { Product, ProductInput } from "../types";

type FormMode = { kind: "hidden" } | { kind: "create" } | { kind: "edit"; product: Product };

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<FormMode>({ kind: "hidden" });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setProducts(await listProducts());
    } catch {
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(input: ProductInput) {
    await createProduct(input);
    setMode({ kind: "hidden" });
    await load();
  }

  async function handleUpdate(id: number, input: ProductInput) {
    await updateProduct(id, input);
    setMode({ kind: "hidden" });
    await load();
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`¿Eliminar "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
      await load();
    } catch {
      setError("No se pudo eliminar el producto.");
    }
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Productos</h2>
        {mode.kind === "hidden" && (
          <button
            onClick={() => setMode({ kind: "create" })}
            className="rounded bg-pink-600 px-4 py-2 font-semibold text-white hover:bg-pink-700"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {mode.kind === "create" && (
        <div className="mb-6">
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setMode({ kind: "hidden" })}
          />
        </div>
      )}

      {mode.kind === "edit" && (
        <div className="mb-6">
          <ProductForm
            initial={mode.product}
            onSubmit={(input) => handleUpdate(mode.product.id, input)}
            onCancel={() => setMode({ kind: "hidden" })}
          />
        </div>
      )}

      {loading ? (
        <p className="text-slate-500">Cargando…</p>
      ) : (
        <ProductTable
          products={products}
          onEdit={(product) => setMode({ kind: "edit", product })}
          onDelete={handleDelete}
        />
      )}
    </Layout>
  );
}
