
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ProductProvider } from "@/context/ProductContext";
import { LocalProductProvider } from "@/context/LocalProductContext";
import { ProductUpdateProvider } from "@/context/ProductUpdateContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { SupplierReferenceProvider } from "@/context/SupplierReferenceContext";
import { TrainingProvider } from "@/context/TrainingContext";
import { RecipeProvider } from "@/context/RecipeContext";
import { NewsProvider } from "@/context/news";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { ShippingProvider } from "@/context/ShippingContext";
import { RecurringOrderProvider } from "@/context/RecurringOrderContext";
import InventorySyncWrapper from "@/components/providers/InventorySyncWrapper";
import AppRoutes from "./config/routes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <FavoritesProvider>
            <ProductProvider>
              <LocalProductProvider>
                <ProductUpdateProvider>
                <ShippingProvider>
                  <SupplierReferenceProvider>
                    <CartProvider>
                      <OrderProvider>
                        <RecurringOrderProvider>
                          <InventoryProvider>
                            <TrainingProvider>
                              <RecipeProvider>
                                <NewsProvider>
                                  <InventorySyncWrapper>
                                    <AppRoutes />
                                  </InventorySyncWrapper>
                                </NewsProvider>
                              </RecipeProvider>
                            </TrainingProvider>
                          </InventoryProvider>
                        </RecurringOrderProvider>
                      </OrderProvider>
                    </CartProvider>
                  </SupplierReferenceProvider>
                </ShippingProvider>
                </ProductUpdateProvider>
              </LocalProductProvider>
            </ProductProvider>
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
