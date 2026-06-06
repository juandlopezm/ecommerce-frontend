import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { CuentaPage } from "./CuentaPage";

function renderPage() {
  return render(
    <MemoryRouter>
      <CuentaPage />
    </MemoryRouter>,
  );
}

describe("CuentaPage", () => {
  it("muestra ambas pestañas: Iniciar sesión y Registrarse", () => {
    renderPage();

    expect(screen.getByRole("button", { name: "Iniciar sesión" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Registrarse" })).toBeInTheDocument();
  });

  it("la pestaña 'Iniciar sesión' está activa por defecto y muestra los campos de email y contraseña", () => {
    renderPage();

    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
  });

  it("el botón de Iniciar sesión está deshabilitado y muestra 'Próximamente'", () => {
    renderPage();

    const loginBtn = screen.getAllByRole("button", { name: "Próximamente" })[0];
    expect(loginBtn).toBeDisabled();
  });

  it("al hacer clic en 'Registrarse' muestra los campos del formulario de registro", () => {
    renderPage();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

    // Assert
    expect(screen.getByLabelText("Nombre completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar contraseña")).toBeInTheDocument();
  });

  it("el botón de Registrarse está deshabilitado y muestra 'Próximamente'", () => {
    renderPage();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

    // Assert
    expect(screen.getByRole("button", { name: "Próximamente" })).toBeDisabled();
  });

  it("muestra el mensaje 'disponible pronto' en la pestaña de inicio de sesión", () => {
    renderPage();

    expect(
      screen.getByText(/El inicio de sesión para clientes estará disponible pronto/),
    ).toBeInTheDocument();
  });

  it("muestra el mensaje 'disponible pronto' en la pestaña de registro", () => {
    renderPage();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

    // Assert
    expect(screen.getByText(/El registro estará disponible pronto/)).toBeInTheDocument();
  });
});
