"""Configuración de las pruebas E2E con pytest-playwright.

La URL base se toma de la variable de entorno E2E_BASE_URL (por defecto el dev server de Vite).
Para probar contra producción: E2E_BASE_URL=https://ecommerce-frontend-okamiga.vercel.app
"""

import os

import pytest


@pytest.fixture(scope="session")
def base_url() -> str:
    return os.getenv("E2E_BASE_URL", "http://localhost:5173")
