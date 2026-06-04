"""E2E de la compra completa: catálogo -> carrito -> checkout -> confirmación (RF-04).

Versión robusta del flujo grabado con codegen: usa base_url (NO una URL de producción fija),
selectores estables por etiqueta, datos de PRUEBA y aserciones que verifican el resultado.

IMPORTANTE: estas pruebas crean un pedido, por eso deben correr contra un entorno EFÍMERO
(backend local con SQLite), nunca contra producción.
"""

import re

from playwright.sync_api import Page, expect


def test_compra_completa_con_pasarela(page: Page) -> None:
    # 1. Agregar un producto desde el detalle.
    page.goto("/")
    page.locator("a[href^='/producto/']").first.click()
    page.get_by_role("button", name="Agregar al carrito").click()

    # 2. Ir al carrito y avanzar al checkout.
    page.goto("/carrito")
    page.get_by_role("link", name=re.compile("Finalizar compra")).click()
    expect(page).to_have_url(re.compile(r"/checkout"))

    # 3. Datos de envío (datos de PRUEBA, no reales).
    page.get_by_label("Nombre completo").fill("Cliente de Prueba")
    page.get_by_label("Correo").fill("prueba@example.com")
    page.get_by_label("Teléfono").fill("3000000000")
    page.get_by_label("Dirección de envío").fill("Calle de prueba 123")

    # 4. Método de pago: pasarela (en sandbox se aprueba).
    page.get_by_text("Pago en línea (pasarela)").click()

    # 5. Confirmar la compra.
    page.get_by_role("button", name="Confirmar compra").click()

    # 6. Aserciones: debe llegar a la confirmación del pedido.
    expect(page).to_have_url(re.compile(r"/pedido/\d+"))
    expect(page.get_by_text("¡Gracias por tu compra!")).to_be_visible()
    expect(page.get_by_text("Total")).to_be_visible()
