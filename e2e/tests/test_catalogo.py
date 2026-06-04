"""E2E del catálogo público (RF-01)."""

from playwright.sync_api import Page, expect

SEARCH_PLACEHOLDER = "Buscar productos, marcas y más…"


def test_catalogo_muestra_productos(page: Page) -> None:
    page.goto("/")
    # La barra de búsqueda y al menos una tarjeta de producto deben ser visibles.
    expect(page.get_by_placeholder(SEARCH_PLACEHOLDER)).to_be_visible()
    expect(page.locator("a[href^='/producto/']").first).to_be_visible()


def test_busqueda_filtra_por_nombre(page: Page) -> None:
    page.goto("/")
    page.get_by_placeholder(SEARCH_PLACEHOLDER).fill("Perfume")
    cards = page.locator("a[href^='/producto/']")
    # Solo el producto "Perfume Floral…" debería quedar.
    expect(cards).to_have_count(1)
    expect(cards.first).to_contain_text("Perfume")
