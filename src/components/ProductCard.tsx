import { useState } from "react";
import { Product } from "../types";
import { useCart } from "../store/CartContext";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, removeFromCart, items } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart(product);
      setIsAdded(true);
    }
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
    setIsAdded(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
        {product.is_gifted && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full flex items-center gap-2">
            <Check className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Already Gifted</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-accent font-bold">${product.price}</span>
          {product.is_gifted ? (
            <span className="text-gray-400 text-sm">No longer available</span>
          ) : (
            <Button 
              onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
              variant={isInCart ? "outline" : "default"}
              className={`${
                isInCart 
                  ? "border-accent text-accent " 
                  : "bg-accent hover:bg-accent/90"
              }`}
            >
              {isInCart ? "Remove from Cart" : "Add to Cart"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}