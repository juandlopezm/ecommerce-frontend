import { useState, type FormEvent } from "react";
import type { Product, ProductInput } from "../types";

interface Props {
  initial?: Product;
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}

function emptyInput(): ProductInput {
  return {
    name: "",
    description: "",
    price: "0.00",
    stock: 0,
    brand: "",
    category: "",
    image_url: "",
    is_active: true,
  };
}

export function ProductForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ProductInput>(
    initial
      ? {
          name: initial.name,
          description: initial.description,
          price: String(initial.price),
          stock: initial.stock,
          brand: initial.brand,
          category: initial.category,
          image_url: initial.image_url,
          is_active: initial.is_active,
        }
      : emptyInput(),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit(form);
    } catch {
      setError("No se pudo guardar el producto. Revisa los datos e inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-pink-500";

  return (
    <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">
        {initial ? "Editar producto" : "Nuevo producto"}
      </h2>

      {error && (
        <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nombre</label>
          <input
            className={input}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Descripción</label>
          <textarea
            className={input}
            rows={2}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Precio (COP)</label>
          <input
            className={input}
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Stock</label>
          <input
            className={input}
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Marca</label>
          <input
            className={input}
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Categoría</label>
          <input
            className={input}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">URL de imagen</label>
          <input
            className={input}
            value={form.image_url}
            onChange={(e) => update("image_url", e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => update("is_active", e.target.checked)}
          />
          Activo (visible en el catálogo)
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-pink-600 px-4 py-2 font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
