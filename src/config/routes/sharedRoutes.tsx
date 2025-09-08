
import { Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OrderRouteHandler from "@/components/routes/OrderRouteHandler";
import NewsRouteHandler from "@/components/routes/NewsRouteHandler";

export const sharedRoutes = (
  <>
    <Route path="/news" element={
      <ProtectedRoute requiredRole={['client', 'supplier', 'admin', 'guest']}>
        <NewsRouteHandler />
      </ProtectedRoute>
    } />
    
    <Route path="/orders" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <Layout>
          <OrderRouteHandler />
        </Layout>
      </ProtectedRoute>
    } />
  </>
);
