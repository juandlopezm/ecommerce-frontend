import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LoginPage } from "./pages/LoginPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OrdersAdminPage } from "./pages/OrdersAdminPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductsPage } from "./pages/ProductsPage";

export default function App() {
  return (
    <Routes>
      {/* Vistas públicas (cliente) */}
      <Route path="/" element={<CatalogPage />} />
      <Route path="/producto/:id" element={<ProductDetailPage />} />
      <Route path="/carrito" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/pedido/:id" element={<OrderConfirmationPage />} />

      {/* Administración */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pedidos"
        element={
          <ProtectedRoute>
            <OrdersAdminPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
