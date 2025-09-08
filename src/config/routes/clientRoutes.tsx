
import { Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Client pages
import Catalog from "@/pages/client/Catalog";
import LocalProducts from "@/pages/client/LocalProducts";
import Cart from "@/pages/client/Cart";
import Inventory from "@/pages/client/Inventory";
import Recipes from "@/pages/client/Recipes";
import RecipeDetail from "@/pages/client/RecipeDetail";
import RecipeCreate from "@/pages/client/RecipeCreate";
import RecipeEdit from "@/pages/client/RecipeEdit";
import Trainings from "@/pages/client/Trainings";
import OrderAnalytics from "@/pages/client/OrderAnalytics";

import SupplierReferences from "@/pages/client/SupplierReferences";
import { RecurringOrders } from "@/pages/client/RecurringOrders";

export const clientRoutes = (
  <>
    <Route path="/catalog" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <Layout>
          <Catalog />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/local-products" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <Layout>
          <LocalProducts />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/cart" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <Layout>
          <Cart />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/inventory" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <Layout>
          <Inventory />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/recipes" element={
      <ProtectedRoute requiredRole={['client']}>
        <Layout>
          <Recipes />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/recipes/:id" element={
      <ProtectedRoute requiredRole={['client']}>
        <Layout>
          <RecipeDetail />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/recipes/new" element={
      <ProtectedRoute requiredRole={['client']}>
        <Layout>
          <RecipeCreate />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/recipes/:id/edit" element={
      <ProtectedRoute requiredRole={['client']}>
        <Layout>
          <RecipeEdit />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/trainings" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <Layout>
          <Trainings />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/client/order-analytics" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <Layout>
          <OrderAnalytics />
        </Layout>
      </ProtectedRoute>
    } />
    
    
    <Route path="/suppliers" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <Layout>
          <SupplierReferences />
        </Layout>
      </ProtectedRoute>
    } />
    
    <Route path="/recurring-orders" element={
      <ProtectedRoute requiredRole={['client', 'guest']}>
        <RecurringOrders />
      </ProtectedRoute>
    } />
  </>
);
