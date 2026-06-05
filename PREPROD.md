# Ambiente de preproducción (Docker Compose)

Levanta **toda la tienda en contenedores**, con paridad de producción (PostgreSQL real + backend
en imagen + frontend servido por Nginx). Sirve para QA, demos y para correr E2E/integración/perf/
seguridad contra un entorno realista **antes de mergear `develop → main`**.

## Levantarlo

Requiere Docker. La imagen del backend se descarga de GHCR (pública); el frontend se construye local.

```bash
docker compose -f docker-compose.preprod.yml up --build
```

- **Frontend (tienda):** http://localhost:8080
- **Backend (API/docs):** http://localhost:8000/docs
- **Admin:** `admin@ecommerce.com` / `Admin123!`

El backend, al arrancar, aplica migraciones (`alembic upgrade head`) y siembra admin + 5 productos
sobre la base PostgreSQL del contenedor `db`. Para detener:

```bash
docker compose -f docker-compose.preprod.yml down        # conserva el volumen de datos
docker compose -f docker-compose.preprod.yml down -v     # borra también los datos
```

## Qué contiene

| Servicio | Imagen | Puerto |
|---|---|---|
| `db` | postgres:16-alpine | interno |
| `backend` | `ghcr.io/juandlopezm/ecommerce-backend:latest` (migra+seed+uvicorn) | 8000 |
| `frontend` | build de Vite servido por Nginx (`Dockerfile`) | 8080 |

> La imagen del backend la publica el workflow `docker-publish.yml` del repo backend en cada push a
> `main`. Para usar la última: `docker compose -f docker-compose.preprod.yml pull backend`.

## Correr las E2E contra preproducción

```bash
cd e2e && .venv\Scripts\activate
E2E_BASE_URL=http://localhost:8080 pytest
```

## Para qué sirve este ambiente

- Validar que las **imágenes Docker construyen y arrancan** antes de desplegar.
- **Paridad con producción** (contenedores + PostgreSQL real + Nginx).
- Correr **E2E / integración / performance (Locust) / seguridad (ZAP)** contra algo realista y aislado.
- Probar **migraciones** sobre una BD desechable, sin tocar producción.
- **QA manual / demos** sobre un stack estable.
- **Puerta de calidad**: promover `develop → main` solo si preproducción está en verde.
