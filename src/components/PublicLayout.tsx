import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold">
            Belleza <span className="text-pink-600">Store</span>
          </Link>
          <Link
            to={user ? "/admin" : "/login"}
            className="text-sm text-slate-500 hover:text-pink-600"
          >
            {user ? "Ir al panel" : "Administración"}
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
      <footer className="px-4 py-8 text-center text-xs text-slate-400">
        © 2026 Belleza Store · MVP
      </footer>
    </div>
  );
}
