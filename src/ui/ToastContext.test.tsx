import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
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
    fireEvent.click(screen.getByRole("button"));

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
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Mensaje temporal")).toBeInTheDocument();

    // Act – avanzamos los timers falsos y flusheamos las actualizaciones de React
    await act(async () => { vi.advanceTimersByTime(2500); });

    // Assert – ya sin waitFor porque los timers están bajo control total
    expect(screen.queryByText("Mensaje temporal")).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByText("Primero"));
    fireEvent.click(screen.getByText("Segundo"));

    // Assert
    expect(screen.getByText("Primer toast")).toBeInTheDocument();
    expect(screen.getByText("Segundo toast")).toBeInTheDocument();
  });
});
