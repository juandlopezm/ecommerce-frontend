# Despliegue gratis — Frontend (Vercel)

El backend va en Render + Neon (ver `ecommerce-backend/DEPLOY.md`). Despliega **primero el backend**
para conocer su URL.

## Pasos en Vercel

1. Crea cuenta en <https://vercel.com> y conecta tu GitHub.
2. **Add New > Project** y selecciona el repo `ecommerce-frontend`.
3. Vercel detecta **Vite** automáticamente:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. En **Environment Variables** agrega:
   - `VITE_API_URL` = `https://TU-BACKEND.onrender.com/api/v1`
     (la URL pública del backend en Render + `/api/v1`).
5. **Deploy**. Tu tienda quedará en `https://tu-frontend.vercel.app`.

El archivo `vercel.json` incluido reescribe todas las rutas a `index.html`, para que el enrutado
del lado del cliente (`/producto/:id`, `/admin`, `/carrito`, etc.) funcione al recargar.

## Después de desplegar

- Copia la URL final de Vercel.
- En **Render**, pon esa URL en `CORS_ORIGINS` (JSON), p. ej. `["https://tu-frontend.vercel.app"]`,
  y redepliega el backend. Sin esto, el navegador bloqueará las llamadas por CORS.

## Probar

- Abre la URL de Vercel → deberías ver el catálogo (los productos los siembra el backend al arrancar).
- Login admin: `admin@ecommerce.com` / la `ADMIN_PASSWORD` que pusiste en Render.

> Recuerda: el backend free de Render "duerme"; la primera carga tras inactividad puede tardar
> ~30-60s mientras despierta.
