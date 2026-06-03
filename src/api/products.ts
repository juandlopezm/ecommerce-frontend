import type { Product, ProductInput } from "../types";
import { api } from "./client";

export async function listProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/products");
  return data;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data } = await api.post<Product>("/products", input);
  return data;
}

export async function updateProduct(
  id: number,
  input: Partial<ProductInput>,
): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, input);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
