import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Redirige a /login si no hay usuario autenticado, o a / si no es administrador. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "administrador") return <Navigate to="/" replace />;
  return <>{children}</>;
}
