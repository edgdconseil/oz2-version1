
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Import all page components
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Import route configurations
import { clientRoutes } from "./routes/clientRoutes";
import { supplierRoutes } from "./routes/supplierRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { sharedRoutes } from "./routes/sharedRoutes";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    
    <Route path="/" element={
      <ProtectedRoute>
        <Layout>
          <Index />
        </Layout>
      </ProtectedRoute>
    } />
    
    {clientRoutes}
    {supplierRoutes}
    {adminRoutes}
    {sharedRoutes}
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
