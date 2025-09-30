
import { Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Admin pages
import AdminUsers from "@/pages/admin/Users";
import AdminProducts from "@/pages/admin/Products";
import ProductValidation from '@/pages/admin/ProductValidation';
import AdminOrders from "@/pages/admin/Orders";
import ShippingCosts from "@/pages/admin/ShippingCosts";
import AdminDepots from "@/pages/admin/Depots";
import ClientTracking from "@/pages/admin/ClientTracking";
import OrderAnalytics from "@/pages/admin/OrderAnalytics";
import Categories from "@/pages/admin/Categories";

export const adminRoutes = (
  <>
    <Route path="/admin/users" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <AdminUsers />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/products" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <AdminProducts />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/product-validation" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <ProductValidation />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/orders" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <AdminOrders />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/shipping-costs" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <ShippingCosts />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/depots" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <AdminDepots />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/client-tracking" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <ClientTracking />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/order-analytics" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <OrderAnalytics />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/categories" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <Categories />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/admin/settings" element={
      <ProtectedRoute requiredRole={['admin']}>
        <Layout>
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-ozego-blue">Paramètres</h1>
            <p className="text-gray-500 mt-2">Cette page est en cours de développement.</p>
          </div>
        </Layout>
      </ProtectedRoute>
    } />
  </>
);
