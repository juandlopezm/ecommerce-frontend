import { useState } from "react";
import { Link } from "react-router-dom";

type Tab = "login" | "register";

export function CuentaPage() {
  const [tab, setTab] = useState<Tab>("login");

  const inputCls =
    "w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-pink-500 bg-slate-50";
  const labelCls = "mb-1 block text-sm font-medium text-slate-700";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 text-center text-2xl font-bold tracking-tight">
          <Link to="/">
            Glow<span className="font-serif italic text-pink-600">Beauty</span>
          </Link>
        </div>

        <div className="rounded-xl bg-white shadow-md">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === "login"
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === "register"
                  ? "border-b-2 border-pink-600 text-pink-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Login tab */}
          {tab === "login" && (
            <div className="p-6">
              <h1 className="mb-1 text-xl font-bold text-slate-800">Bienvenida</h1>
              <p className="mb-5 text-sm text-slate-500">
                El inicio de sesión para clientes estará disponible pronto.
              </p>

              <div className="mb-4">
                <label htmlFor="cuenta-email" className={labelCls}>
                  Correo electrónico
                </label>
                <input
                  id="cuenta-email"
                  type="email"
                  placeholder="tu@correo.com"
                  className={inputCls}
                  disabled
                />
              </div>

              <div className="mb-6">
                <label htmlFor="cuenta-password" className={labelCls}>
                  Contraseña
                </label>
                <input
                  id="cuenta-password"
                  type="password"
                  placeholder="••••••••"
                  className={inputCls}
                  disabled
                />
              </div>

              <button
                type="button"
                disabled
                className="w-full rounded bg-pink-600 py-2 font-semibold text-white opacity-60 cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>
          )}

          {/* Register tab */}
          {tab === "register" && (
            <div className="p-6">
              <h1 className="mb-1 text-xl font-bold text-slate-800">Crear cuenta</h1>
              <p className="mb-5 text-sm text-slate-500">
                El registro estará disponible pronto.
              </p>

              <div className="mb-4">
                <label htmlFor="reg-name" className={labelCls}>
                  Nombre completo
                </label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Tu nombre"
                  className={inputCls}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label htmlFor="reg-email" className={labelCls}>
                  Correo electrónico
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="tu@correo.com"
                  className={inputCls}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label htmlFor="reg-password" className={labelCls}>
                  Contraseña
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••"
                  className={inputCls}
                  disabled
                />
              </div>

              <div className="mb-6">
                <label htmlFor="reg-confirm" className={labelCls}>
                  Confirmar contraseña
                </label>
                <input
                  id="reg-confirm"
                  type="password"
                  placeholder="••••••••"
                  className={inputCls}
                  disabled
                />
              </div>

              <button
                type="button"
                disabled
                className="w-full rounded bg-pink-600 py-2 font-semibold text-white opacity-60 cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
