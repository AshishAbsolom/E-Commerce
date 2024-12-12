import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: number) => void;
}

export const CartItem = ({ item, onRemove }: CartItemProps) => {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-4">
      <img
        src={item.image_url}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-accent font-bold">${item.price}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};