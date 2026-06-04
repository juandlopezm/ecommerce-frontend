import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { StoreHeader } from "./StoreHeader";

interface Props {
  children: ReactNode;
  /** Buscador controlado (lo usa el catálogo para filtrar en vivo). */
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function PublicLayout({ children, search, onSearchChange }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <StoreHeader search={search} onSearchChange={onSearchChange} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 md:pb-6">{children}</main>

      <footer className="hidden px-4 py-8 text-center text-xs text-slate-400 md:block">
        © 2026 GlowBeauty · MVP
      </footer>

      {/* Navegación inferior (móvil) — decorativa */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-slate-200 bg-white py-2 text-[11px] text-slate-500 md:hidden">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-pink-600">
          <span>🏠</span>Inicio
        </Link>
        <span className="flex flex-col items-center gap-0.5">
          <span>🗂️</span>Categorías
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <span>🏷️</span>Ofertas
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <span>🤍</span>Favoritos
        </span>
        <Link to="/login" className="flex flex-col items-center gap-0.5">
          <span>👤</span>Mi cuenta
        </Link>
      </nav>
    </div>
  );
}
