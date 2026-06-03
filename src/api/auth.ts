import type { User } from "../types";
import { api } from "./client";

/** Login OAuth2 (form-urlencoded). Devuelve el access_token. */
export async function login(email: string, password: string): Promise<string> {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);
  const { data } = await api.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data.access_token as string;
}

/** Datos del usuario autenticado. */
export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}
