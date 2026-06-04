# Pruebas E2E (pytest-playwright)

Pruebas de extremo a extremo que manejan un navegador real contra la tienda corriendo.

## Requisitos

```bash
cd e2e
python -m venv .venv
.venv\Scripts\activate            # Windows
pip install -r requirements.txt
playwright install chromium       # descarga el navegador
```

## Levantar la app (otra terminal)

Backend en `:8000` y frontend en `:5173` apuntando a ese backend:

```bash
# Backend (con admin + productos sembrados)
cd ../../ecommerce-backend
alembic upgrade head && python -m app.seed && python -m app.seed_products
uvicorn app.main:app --port 8000

# Frontend
cd ../ecommerce-frontend
# Windows PowerShell:  $env:VITE_API_URL="http://localhost:8000/api/v1"; npm run dev
VITE_API_URL=http://localhost:8000/api/v1 npm run dev
```

## Ejecutar las pruebas

```bash
cd e2e
pytest                       # headless contra http://localhost:5173
pytest --headed              # viendo el navegador
```

## Configuración por variables de entorno

- `E2E_BASE_URL` — URL a probar (por defecto `http://localhost:5173`).
  Para producción: `E2E_BASE_URL=https://ecommerce-frontend-okamiga.vercel.app pytest`
- `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD` — credenciales del admin (por defecto las del seed).

## Qué cubre

- **test_catalogo.py**: el catálogo muestra productos y la búsqueda filtra.
- **test_carrito.py**: detalle → agregar al carrito → carrito con resumen.
- **test_admin.py**: login admin entra al panel; credenciales inválidas muestran error.

## Generar pruebas grabando (Playwright Codegen)

En lugar de escribirlas a mano, puedes **grabarlas**: se abre un navegador, haces clic como usuario y
Playwright genera el código en formato pytest.

Con la app corriendo (backend + frontend), desde la carpeta `e2e`:

```bash
.venv\Scripts\activate            # Windows (o: source .venv/bin/activate)

# Graba contra tu app local y guarda el resultado como prueba pytest:
playwright codegen http://localhost:5173 --target python-pytest -o tests/test_grabado.py
```

- Se abre el navegador + el **Inspector**. Navega/haz clic: el código aparece en vivo.
- En la barra del Inspector puedes añadir **aserciones** (assert visible, assert text…).
- Al cerrar la ventana, queda generado `tests/test_grabado.py`. Revísalo, renómbralo y córrelo con
  `pytest`.

También puedes grabar contra **producción**:

```bash
playwright codegen https://ecommerce-frontend-okamiga.vercel.app --target python-pytest
```

> `--target` admite `python-pytest`, `python`, `python-async`, `javascript`, etc.
