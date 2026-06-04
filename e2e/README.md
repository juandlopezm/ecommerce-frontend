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
