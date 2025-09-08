
import { Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Supplier pages
import SupplierProducts from "@/pages/supplier/Products";

export const supplierRoutes = (
  <>
    <Route path="/products" element={
      <ProtectedRoute requiredRole={['supplier']}>
        <Layout>
          <SupplierProducts />
        </Layout>
      </ProtectedRoute>
    } />
  </>
);
