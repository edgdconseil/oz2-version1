
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import ClientNews from "@/pages/client/News";
import SupplierNews from "@/pages/supplier/News";
import AdminNews from "@/pages/admin/News";

const NewsRouteHandler = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'client' || user.role === 'guest') {
    return (
      <Layout>
        <ClientNews />
      </Layout>
    );
  } else if (user.role === 'supplier') {
    return (
      <Layout>
        <SupplierNews />
      </Layout>
    );
  } else if (user.role === 'admin') {
    return (
      <Layout>
        <AdminNews />
      </Layout>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default NewsRouteHandler;
