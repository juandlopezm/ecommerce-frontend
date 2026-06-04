import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
    isActive ? "bg-pink-600 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
  }`;

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold">
              Panel · <span className="text-pink-400">Belleza</span>
            </h1>
            <nav className="flex items-center gap-2">
              <NavLink to="/admin" end className={navClass}>
                Productos
              </NavLink>
              <NavLink to="/admin/pedidos" className={navClass}>
                Pedidos
              </NavLink>
            </nav>
          </div>
          {user && (
            <div className="flex items-center gap-3 text-sm">
              <span className="hidden sm:inline">
                {user.full_name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="rounded bg-slate-700 px-3 py-1 hover:bg-slate-600"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
