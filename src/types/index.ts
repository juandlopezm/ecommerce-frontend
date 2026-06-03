export type Role = "cliente" | "invitado" | "administrador";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  brand: string;
  category: string;
  image_url: string;
  is_active: boolean;
  is_available: boolean;
}

export interface ProductInput {
  name: string;
  description: string;
  price: string;
  stock: number;
  brand: string;
  category: string;
  image_url: string;
  is_active: boolean;
}
