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

export type OrderStatus = "pendiente" | "confirmado" | "enviado" | "cancelado";
export type PaymentMethod = "pasarela" | "contra_entrega";
export type PaymentStatus = "aprobado" | "rechazado" | "pendiente";

export interface OrderItem {
  product_id: number;
  product_name: string;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  total: string;
  items: OrderItem[];
  created_at: string;
}
