import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchMe, login as apiLogin } from "../api/auth";
import { setAuthToken } from "../api/client";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);
const TOKEN_KEY = "ecommerce_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setReady(true);
      return;
    }
    setAuthToken(stored);
    fetchMe()
      .then(setUser)
      .catch(() => {
        setAuthToken(null);
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setReady(true));
  }, []);

  async function login(email: string, password: string): Promise<User> {
    const token = await apiLogin(email, password);
    setAuthToken(token);
    const me = await fetchMe();
    localStorage.setItem(TOKEN_KEY, token);
    setUser(me);
    return me;
  }

  function logout(): void {
    setAuthToken(null);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  if (!ready) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
