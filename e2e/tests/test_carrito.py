"""E2E del carrito: detalle -> agregar al carrito -> carrito (RF-01/RF-03)."""

import re

from playwright.sync_api import Page, expect


def test_agregar_al_carrito_desde_detalle(page: Page) -> None:
    page.goto("/")

    # Abrir el detalle del primer producto.
    page.locator("a[href^='/producto/']").first.click()
    expect(page).to_have_url(re.compile(r"/producto/\d+"))

    # Agregar al carrito.
    page.get_by_role("button", name="Agregar al carrito").click()

    # El carrito debe mostrar el resumen y el botón de finalizar compra.
    page.goto("/carrito")
    expect(page.get_by_role("heading", name=re.compile("Tu carrito"))).to_be_visible()
    expect(page.get_by_text("Subtotal")).to_be_visible()
    expect(page.get_by_role("link", name=re.compile("Finalizar compra"))).to_be_visible()
