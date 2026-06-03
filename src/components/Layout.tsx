import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">
            Panel de administración · <span className="text-pink-400">Belleza</span>
          </h1>
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
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
