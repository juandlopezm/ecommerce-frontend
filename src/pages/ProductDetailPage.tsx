import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/products";
import { useCart } from "../cart/CartContext";
import { PublicLayout } from "../components/PublicLayout";
import { RelatedProducts } from "../components/RelatedProducts";
import type { Product } from "../types";
import { useToast } from "../ui/ToastContext";
import { formatCOP } from "../utils/format";

// Contenido decorativo (sin backend aún: reseñas y beneficios son fases posteriores).
const BENEFITS = [
  "Larga duración (8h+)",
  "Hidratación profunda",
  "No reseca",
  "Cruelty free",
  "Vegano",
];
const REVIEWS = [
  {
    name: "Valeria M.",
    text: "Me encanta este tono, es perfecto para el diario. Dura mucho y no reseca mis labios.",
    time: "Hace 2 días",
  },
  {
    name: "Sofía R.",
    text: "Color hermoso y muy buena calidad. Definitivamente lo recomiendo.",
    time: "Hace 1 semana",
  },
  {
    name: "Camila P.",
    text: "El mejor labial que he probado. Súper pigmentado y cómodo.",
    time: "Hace 2 semanas",
  },
];
const RATING_BARS = [
  { stars: 5, pct: 85 },
  { stars: 4, pct: 10 },
  { stars: 3, pct: 3 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];
const TABS = ["Comentarios", "Detalles", "Ingredientes"] as const;
type Tab = (typeof TABS)[number];

export function ProductDetailPage() {
  const { id } = useParams();
  const { add } = useCart();
  const { show } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("Comentarios");

  useEffect(() => {
    const pid = Number(id);
    if (!pid) {
      setError("Producto no válido.");
      setLoading(false);
      return;
    }
    setLoading(true);
    getProduct(pid)
      .then(setProduct)
      .catch(() => setError("Producto no encontrado."))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    if (!product) return;
    add(product, qty);
    show(`${product.name} agregado al carrito`);
  }

  if (loading) {
    return (
      <PublicLayout>
        <p className="text-slate-500">Cargando…</p>
      </PublicLayout>
    );
  }

  if (error || !product) {
    return (
      <PublicLayout>
        <p className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          {error ?? "Producto no encontrado."}
        </p>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link to="/" className="hover:text-pink-600">
          Inicio
        </Link>
        {product.category && (
          <>
            <span>›</span>
            <span>{product.category}</span>
          </>
        )}
        <span>›</span>
        <span className="font-medium text-slate-700">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tarjeta de imagen + compra */}
        <div className="animate-fade-in-up rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-lg font-bold uppercase tracking-wide text-pink-600">
            {product.name}
          </h1>

          <div className="flex gap-4">
            <div className="hidden w-16 shrink-0 sm:block">
              <div className="overflow-hidden rounded-xl border-2 border-pink-300 bg-slate-100">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-16 w-16 object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center text-[10px] text-slate-300">
                    Sin img
                  </div>
                )}
              </div>
            </div>

            <div className="relative flex-1">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100">
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
              {/* Badge de valoración (decorativo) */}
              <div className="absolute bottom-3 right-3 flex flex-col items-center rounded-full bg-white/90 px-4 py-2 shadow">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <span className="text-pink-500">★</span>4.8/5
                </span>
                <span className="text-[10px] text-slate-400">128 reseñas</span>
              </div>
            </div>
          </div>

          {/* Barra precio + agregar */}
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-slate-100 p-4 shadow-sm">
            <span className="text-2xl font-extrabold text-pink-600">{formatCOP(product.price)}</span>
            <div className="ml-auto flex items-center gap-3">
              {product.is_available && (
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:border-pink-500"
                >
                  {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              )}
              <button
                onClick={handleAdd}
                disabled={!product.is_available}
                className="rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {product.is_available ? "🛒 Agregar al carrito" : "Agotado"}
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha: social proof + descripción + specs */}
        <div className="space-y-4">
          {/* Social proof (decorativo) */}
          <div className="animate-fade-in-up flex items-center gap-4 rounded-2xl bg-indigo-50 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-200 text-xl">
              💜
            </div>
            <div>
              <p className="font-bold text-indigo-700">MUY BONITO</p>
              <p className="text-sm text-slate-500">¡A muchas les encanta este producto!</p>
            </div>
          </div>

          {/* Descripción + beneficios + specs */}
          <div className="animate-fade-in-up rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 font-bold text-slate-800">Descripción</h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {product.description || "Sin descripción disponible para este producto."}
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span className="text-pink-500">♥</span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
              <Spec label="Marca" value={product.brand || "—"} />
              <Spec label="Categoría" value={product.category || "—"} />
              <Spec label="Disponibilidad" value={product.is_available ? "En stock" : "Agotado"} />
              <Spec label="Unidades" value={String(product.stock)} />
            </div>
          </div>

          {/* Envío / Garantía (decorativo) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              icon="🚚"
              title="Envío gratis"
              text="En compras mayores a $150.000"
            />
            <InfoCard
              icon="🛡️"
              title="Garantía"
              text="30 días de garantía de satisfacción"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex gap-2 border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
                tab === t
                  ? "bg-pink-50 text-pink-600"
                  : "text-slate-500 hover:text-pink-600"
              }`}
            >
              {t === "Comentarios" ? "Comentarios (128)" : t}
            </button>
          ))}
        </div>

        <div className="animate-fade-in rounded-b-2xl bg-white p-6 shadow-sm">
          {tab === "Comentarios" && <Reviews />}
          {tab === "Detalles" && (
            <p className="text-sm leading-relaxed text-slate-600">
              {product.description || "Sin detalles adicionales."}
            </p>
          )}
          {tab === "Ingredientes" && (
            <p className="text-sm text-slate-500">
              La información de ingredientes estará disponible próximamente.
            </p>
          )}
        </div>
      </div>

      <RelatedProducts category={product.category} excludeId={product.id} />
    </PublicLayout>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-slate-700">{label}</p>
      <p className="text-slate-500">{value}</p>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}

/** Bloque de reseñas (contenido decorativo). */
function Reviews() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="rounded-2xl bg-slate-50 p-5 text-center">
        <p className="text-4xl font-extrabold text-slate-800">4.8</p>
        <p className="text-pink-500">★★★★★</p>
        <p className="mt-1 text-xs text-slate-400">Basado en 128 reseñas</p>
        <div className="mt-4 space-y-1">
          {RATING_BARS.map((r) => (
            <div key={r.stars} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-slate-500">{r.stars} ★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-pink-500" style={{ width: `${r.pct}%` }} />
              </div>
              <span className="w-8 text-right text-slate-400">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
        {REVIEWS.map((rev) => (
          <div key={rev.name} className="rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="font-semibold text-slate-800">{rev.name}</p>
            <p className="mb-1 text-xs text-green-600">✓ Compra verificada</p>
            <p className="text-pink-500">★★★★★</p>
            <p className="mt-2 text-sm text-slate-600">{rev.text}</p>
            <p className="mt-2 text-xs text-slate-400">{rev.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
