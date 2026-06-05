import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "./ToastContext";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useToast fuera del provider", () => {
  it("lanza error descriptivo si se usa fuera de ToastProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow(
      "useToast debe usarse dentro de ToastProvider",
    );
    spy.mockRestore();
  });
});

describe("show()", () => {
  it("muestra el mensaje del toast en el DOM", () => {
    // Arrange
    function Trigger() {
      const { show } = useToast();
      return <button onClick={() => show("Producto agregado al carrito")}>Mostrar</button>;
    }
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    // Act
    screen.getByRole("button").click();

    // Assert
    expect(screen.getByText("Producto agregado al carrito")).toBeInTheDocument();
  });

  it("el toast desaparece automáticamente después de 2500 ms", async () => {
    // Arrange
    function Trigger() {
      const { show } = useToast();
      return <button onClick={() => show("Mensaje temporal")}>Mostrar</button>;
    }
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    screen.getByRole("button").click();
    expect(screen.getByText("Mensaje temporal")).toBeInTheDocument();

    // Act
    act(() => vi.advanceTimersByTime(2500));

    // Assert
    await waitFor(() =>
      expect(screen.queryByText("Mensaje temporal")).not.toBeInTheDocument(),
    );
  });

  it("puede mostrar múltiples toasts simultáneamente", () => {
    // Arrange
    function Trigger() {
      const { show } = useToast();
      return (
        <>
          <button onClick={() => show("Primer toast")}>Primero</button>
          <button onClick={() => show("Segundo toast")}>Segundo</button>
        </>
      );
    }
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );

    // Act
    screen.getByText("Primero").click();
    screen.getByText("Segundo").click();

    // Assert
    expect(screen.getByText("Primer toast")).toBeInTheDocument();
    expect(screen.getByText("Segundo toast")).toBeInTheDocument();
  });
});
