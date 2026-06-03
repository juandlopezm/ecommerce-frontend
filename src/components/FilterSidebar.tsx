import { formatCOP } from "../utils/format";

interface Counted {
  name: string;
  count: number;
}

interface Props {
  categories: Counted[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  brands: Counted[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  priceBound: number;
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
}

const TIPOS = ["Serum", "Base", "Labial", "Crema", "Perfume", "Máscara"];
const RATINGS = [4.5, 4, 3.5, 3];

export function FilterSidebar(props: Props) {
  const {
    categories,
    selectedCategory,
    onSelectCategory,
    brands,
    selectedBrands,
    onToggleBrand,
    priceBound,
    maxPrice,
    onMaxPriceChange,
  } = props;

  return (
    <aside className="w-64 shrink-0 space-y-6 rounded-2xl bg-white p-5 shadow-sm">
      {/* Categorías (funcional) */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wide text-slate-700">⊞ CATEGORÍAS</h3>
        <ul className="space-y-1.5 text-sm">
          {categories.map((c) => (
            <li key={c.name}>
              <button
                onClick={() => onSelectCategory(selectedCategory === c.name ? "" : c.name)}
                className={`flex w-full items-center justify-between rounded px-2 py-1 ${
                  selectedCategory === c.name
                    ? "bg-pink-50 font-semibold text-pink-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{c.name}</span>
                <span className="text-xs text-slate-400">{c.count}</span>
              </button>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="px-2 text-xs text-slate-400">Sin categorías todavía</li>
          )}
        </ul>
      </div>

      {/* Marca (funcional) */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wide text-slate-700">MARCA</h3>
        <ul className="space-y-1.5 text-sm">
          {brands.map((b) => (
            <li key={b.name}>
              <label className="flex cursor-pointer items-center justify-between rounded px-2 py-1 hover:bg-slate-50">
                <span className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b.name)}
                    onChange={() => onToggleBrand(b.name)}
                    className="accent-pink-600"
                  />
                  {b.name}
                </span>
                <span className="text-xs text-slate-400">({b.count})</span>
              </label>
            </li>
          ))}
          {brands.length === 0 && (
            <li className="px-2 text-xs text-slate-400">Sin marcas todavía</li>
          )}
        </ul>
      </div>

      {/* Rango de precio (funcional) */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wide text-slate-700">RANGO DE PRECIO</h3>
        <input
          type="range"
          min={0}
          max={priceBound}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-pink-600"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{formatCOP(0)}</span>
          <span>{formatCOP(maxPrice)}</span>
        </div>
      </div>

      {/* Tipo de producto (decorativo) */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wide text-slate-700">TIPO DE PRODUCTO</h3>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <span
              key={t}
              className="cursor-default rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Valoración (decorativo) */}
      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wide text-slate-700">VALORACIÓN</h3>
        <ul className="space-y-1.5 text-sm text-slate-500">
          {RATINGS.map((r) => (
            <li key={r} className="flex items-center gap-2">
              <span className="text-pink-500">
                {"★".repeat(Math.floor(r))}
                {r % 1 ? "½" : ""}
              </span>
              <span className="text-xs">o más</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
