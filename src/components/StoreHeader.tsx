import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  /** Si se pasa junto a onSearchChange, el buscador es controlado (filtra en vivo). */
  search?: string;
  onSearchChange?: (value: string) => void;
}

/** Cabecera de la tienda (GlowBeauty): logo, buscador y accesos de cuenta/favoritos/carrito.
 *  Carrito y favoritos son decorativos por ahora (sin backend). */
export function StoreHeader({ search, onSearchChange }: Props) {
  const navigate = useNavigate();
  const controlled = onSearchChange !== undefined;
  const [internal, setInternal] = useState("");
  const value = controlled ? (search ?? "") : internal;

  function handleChange(v: string) {
    if (controlled) onSearchChange?.(v);
    else setInternal(v);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!controlled) navigate(`/?q=${encodeURIComponent(internal.trim())}`);
  }

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="shrink-0 text-2xl font-bold tracking-tight">
          Glow<span className="font-serif italic text-pink-600">Beauty</span>
        </Link>

        <form onSubmit={handleSubmit} className="relative mx-auto hidden flex-1 md:block">
          <input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Buscar productos, marcas y más…"
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 pr-11 text-sm outline-none focus:border-pink-400 focus:bg-white"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-600"
          >
            <SearchIcon />
          </button>
        </form>

        <nav className="flex shrink-0 items-center gap-5 text-sm text-slate-700">
          <Link to="/login" className="flex items-center gap-1.5 hover:text-pink-600">
            <UserIcon />
            <span className="hidden lg:inline">Mi cuenta</span>
          </Link>
          <button
            type="button"
            title="Próximamente"
            className="relative flex items-center gap-1.5 hover:text-pink-600"
          >
            <HeartIcon />
            <span className="hidden lg:inline">Favoritos</span>
            <Badge>3</Badge>
          </button>
          <button
            type="button"
            title="Próximamente"
            className="relative flex items-center gap-1.5 hover:text-pink-600"
          >
            <CartIcon />
            <span className="hidden lg:inline">Carrito</span>
            <Badge>2</Badge>
          </button>
        </nav>
      </div>
    </header>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-600 px-1 text-[10px] font-semibold text-white">
      {children}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.5L23 7H6" strokeLinecap="round" />
    </svg>
  );
}
