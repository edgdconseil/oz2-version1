
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import ClientOrders from "@/pages/client/Orders";

const OrderRouteHandler = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'client' || user.role === 'guest') {
    // Ne pas créer un nouveau Layout ici, utiliser celui qui existe déjà
    return <ClientOrders />;
  } else {
    // Rediriger les fournisseurs et autres rôles vers le tableau de bord
    return <Navigate to="/" />;
  }
};

export default OrderRouteHandler;
