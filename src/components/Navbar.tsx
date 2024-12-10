import { Link } from "react-router-dom";
import { useCart } from "../store/CartContext";
import { ShoppingCart, Baby } from "lucide-react";

export function Navbar() {
  const { items } = useCart();

  return (
    <nav className="fixed top-4 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-xl rounded-xl shadow-lg px-6 py-3 flex justify-between items-center border border-white/10 animate-fade-in hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r from-[#accbee]/20 via-[#e7f0fd]/10 to-[#accbee]/20">
          <Link to="/" className="flex items-center gap-2 text-accent">
            <Baby className="w-6 h-6" />
            <span className="text-lg font-semibold">The Balm Family Store</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-600 hover:text-accent"
          >
            <ShoppingCart />
            <span className="bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-sm">
              {items.length}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}