import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "administrador") {
        logout();
        setError("Esta cuenta no tiene permisos de administrador.");
        return;
      }
      navigate("/productos", { replace: true });
    } catch {
      setError("Credenciales inválidas. Verifica tu correo y contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md"
      >
        <h1 className="mb-1 text-2xl font-bold text-slate-800">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-slate-500">Panel de administración</p>

        {error && (
          <div className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-pink-500"
          placeholder="admin@ecommerce.com"
        />

        <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-pink-500"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-pink-600 py-2 font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
