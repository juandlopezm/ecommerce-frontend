import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductForm } from "./ProductForm";
import type { Product } from "../types";

const mockProduct: Product = {
  id: 5,
  name: "Labial Rosa Intenso",
  description: "Descripción de prueba",
  price: "29900",
  stock: 10,
  brand: "GlowBrand",
  category: "Labios",
  image_url: "https://example.com/img.jpg",
  is_active: true,
  is_available: true,
};

describe("ProductForm – modo creación", () => {
  it("muestra el título 'Nuevo producto' cuando no se pasa initial", () => {
    render(<ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Nuevo producto")).toBeInTheDocument();
  });

  it("el campo Nombre está vacío al inicializar el formulario en blanco", () => {
    render(<ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText("Nombre")).toHaveValue("");
  });

  it("llama a onCancel al hacer clic en Cancelar", () => {
    // Arrange
    const onCancel = vi.fn();
    render(<ProductForm onSubmit={vi.fn()} onCancel={onCancel} />);

    // Act
    fireEvent.click(screen.getByText("Cancelar"));

    // Assert
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("llama a onSubmit con los datos del formulario al guardar", async () => {
    // Arrange
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ProductForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    // Act
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Nuevo Producto" } });
    fireEvent.change(screen.getByLabelText("Precio (COP)"), { target: { value: "50000" } });
    fireEvent.click(screen.getByText("Guardar"));

    // Assert
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Nuevo Producto", price: "50000" }),
    );
  });

  it("muestra 'Guardando…' y deshabilita el botón mientras se guarda", async () => {
    // Arrange: onSubmit que no resuelve de inmediato
    let resolve: () => void;
    const onSubmit = vi.fn(
      () => new Promise<void>((res) => { resolve = res; }),
    );
    render(<ProductForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Prod" } });

    // Act
    fireEvent.click(screen.getByText("Guardar"));

    // Assert – en estado de guardado
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /guardando/i })).toBeDisabled(),
    );

    // Cleanup
    act(() => resolve());
    await waitFor(() => expect(screen.getByText("Guardar")).toBeInTheDocument());
  });

  it("muestra mensaje de error cuando onSubmit lanza una excepción", async () => {
    // Arrange
    const onSubmit = vi.fn().mockRejectedValue(new Error("Error de servidor"));
    render(<ProductForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Nombre"), { target: { value: "Prod" } });

    // Act
    fireEvent.click(screen.getByText("Guardar"));

    // Assert
    await waitFor(() =>
      expect(screen.getByText(/No se pudo guardar/)).toBeInTheDocument(),
    );
  });
});

describe("ProductForm – modo edición", () => {
  it("muestra el título 'Editar producto' cuando se pasa initial", () => {
    render(<ProductForm initial={mockProduct} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Editar producto")).toBeInTheDocument();
  });

  it("pre-rellena Nombre, Descripción y Marca con los datos del producto existente", () => {
    render(<ProductForm initial={mockProduct} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText("Nombre")).toHaveValue(mockProduct.name);
    expect(screen.getByLabelText("Descripción")).toHaveValue(mockProduct.description);
    expect(screen.getByLabelText("Marca")).toHaveValue(mockProduct.brand);
  });
});
