import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Product } from "../types";
import { CartProvider, useCart } from "./CartContext";

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Labial",
    description: "",
    price: "10000",
    stock: 5,
    brand: "NYX",
    category: "Maquillaje",
    image_url: "",
    is_active: true,
    is_available: true,
    ...overrides,
  };
}

function setup() {
  return renderHook(() => useCart(), { wrapper: CartProvider });
}

beforeEach(() => {
  localStorage.clear();
});

describe("CartContext", () => {
  it("agrega un producto y calcula conteo y subtotal", () => {
    const { result } = setup();
    act(() => result.current.add(product(), 2));
    expect(result.current.count).toBe(2);
    expect(result.current.subtotal).toBe(20000);
  });

  it("no permite superar el stock disponible", () => {
    const { result } = setup();
    act(() => result.current.add(product({ stock: 3 }), 10));
    expect(result.current.items[0].quantity).toBe(3);
  });

  it("acumula cantidad al agregar el mismo producto", () => {
    const { result } = setup();
    act(() => result.current.add(product(), 1));
    act(() => result.current.add(product(), 1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.count).toBe(2);
  });

  it("ignora productos agotados (stock 0)", () => {
    const { result } = setup();
    act(() => result.current.add(product({ stock: 0, is_available: false })));
    expect(result.current.items).toHaveLength(0);
  });

  it("actualiza la cantidad respetando el mínimo 1 y el stock", () => {
    const { result } = setup();
    act(() => result.current.add(product({ stock: 5 }), 2));
    act(() => result.current.updateQty(1, 99));
    expect(result.current.items[0].quantity).toBe(5); // tope = stock
    act(() => result.current.updateQty(1, 0));
    expect(result.current.items[0].quantity).toBe(1); // mínimo = 1
  });

  it("elimina un producto y vacía el carrito", () => {
    const { result } = setup();
    act(() => result.current.add(product(), 2));
    act(() => result.current.remove(1));
    expect(result.current.items).toHaveLength(0);
    act(() => result.current.add(product(), 1));
    act(() => result.current.clear());
    expect(result.current.count).toBe(0);
  });

  it("persiste el carrito en localStorage", () => {
    const { result } = setup();
    act(() => result.current.add(product(), 2));
    expect(localStorage.getItem("ecommerce_cart")).toContain("Labial");
  });
});
