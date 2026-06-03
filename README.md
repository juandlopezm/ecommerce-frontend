# ecommerce-frontend

Interfaz web del e-commerce de productos de belleza (MVP). Cliente desacoplado que consume la API de
`ecommerce-backend`. Esta primera entrega es el **panel de administración**: login y CRUD de productos.

## Stack

- **Vite + React + TypeScript** — SPA.
- **Tailwind CSS v4** — estilos.
- **React Router** — enrutamiento.
- **Axios** — cliente HTTP (adjunta el JWT a las peticiones).

## Estructura

```
src/
  api/         # cliente axios + llamadas (auth, products)
  auth/        # AuthContext (JWT en localStorage) + ProtectedRoute
  components/  # Layout, ProductTable, ProductForm
  pages/       # LoginPage, ProductsPage (panel CRUD)
  types/       # tipos compartidos (User, Product)
```

## Puesta en marcha

```bash
npm install
copy .env.example .env     # Windows — ajusta VITE_API_URL si hace falta
npm run dev                # http://localhost:5173
```

Requiere el backend corriendo en `http://localhost:8000` (ver `ecommerce-backend`). El backend ya
tiene CORS habilitado para `http://localhost:5173`. Inicia sesión con el administrador sembrado
(`python -m app.seed` en el backend; por defecto `admin@ecommerce.com` / `Admin123!`).

## Funcionalidad

- **Login** (`/login`): autenticación contra `/api/v1/auth/login`; exige rol `administrador`.
- **Panel de productos** (`/productos`, protegido): listar, crear, editar y eliminar productos
  consumiendo `/api/v1/products`.

## Scripts

```bash
npm run dev       # servidor de desarrollo
npm run build     # typecheck (tsc) + build de producción
npm run preview   # sirve el build
```

## Git Flow

- `main` — releases estables.
- `develop` — integración.
- `feature/*` — desarrollo (p. ej. `feature/admin-panel`).
