import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./store/CartContext";
import Welcome from "./pages/Welcome";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Download from "./pages/Download";
import ThankYou from './pages/ThankYou';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/Alana" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/download" element={<Download />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </Router>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;