"""E2E del login de administración (RF-07 / RF-08.1 / HU-12/HU-13)."""

import os
import re

from playwright.sync_api import Page, expect

ADMIN_EMAIL = os.getenv("E2E_ADMIN_EMAIL", "admin@ecommerce.com")
ADMIN_PASSWORD = os.getenv("E2E_ADMIN_PASSWORD", "Admin123!")


def test_login_admin_entra_al_panel(page: Page) -> None:
    page.goto("/login")
    page.get_by_placeholder("admin@ecommerce.com").fill(ADMIN_EMAIL)
    page.get_by_placeholder("••••••••").fill(ADMIN_PASSWORD)
    page.get_by_role("button", name="Entrar").click()

    # Tras autenticar como admin, debe llegar al panel.
    expect(page).to_have_url(re.compile(r"/admin"))
    expect(page.get_by_role("link", name="Pedidos")).to_be_visible()


def test_login_credenciales_invalidas_muestra_error(page: Page) -> None:
    page.goto("/login")
    page.get_by_placeholder("admin@ecommerce.com").fill(ADMIN_EMAIL)
    page.get_by_placeholder("••••••••").fill("incorrecta")
    page.get_by_role("button", name="Entrar").click()

    expect(page.get_by_text(re.compile("Credenciales inválidas"))).to_be_visible()
