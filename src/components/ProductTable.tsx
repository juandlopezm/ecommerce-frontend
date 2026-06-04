import type { Product } from "../types";
import { formatCOP } from "../utils/format";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: Props) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg bg-white p-6 text-center text-slate-500 shadow">
        No hay productos todavía. Crea el primero con “Nuevo producto”.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Marca</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3 text-right">Precio</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
              <td className="px-4 py-3 text-slate-600">{p.brand || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{p.category || "—"}</td>
              <td className="px-4 py-3 text-right">{formatCOP(p.price)}</td>
              <td className="px-4 py-3 text-right">{p.stock}</td>
              <td className="px-4 py-3">
                {p.is_available ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Disponible
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    Agotado/Inactivo
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="rounded bg-slate-200 px-3 py-1 text-slate-700 hover:bg-slate-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    className="rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
