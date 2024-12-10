import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useCart } from "../store/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialNote: "",
  });

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    try {
      // Insert order with items as JSONB
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_name: `${formData.firstName} ${formData.lastName}`,
          total_price: totalPrice,
          special_note: formData.specialNote,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price
          }))
        })
        .select()
        .single();

      if (orderError) throw orderError;

      if (!order) throw new Error("No order was created");

      // Update products as gifted
      const { error: updateError } = await supabase
        .from("products")
        .update({ is_gifted: true })
        .in(
          "id",
          items.map((item) => item.id)
        );

      if (updateError) throw updateError;

      toast({
        title: "Thank you for your gift!",
        description: "Your order has been placed successfully.",
      });

      clearCart();
      navigate("/products");
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 text-center">
          <p className="text-gray-600">Your cart is empty</p>
          <Button
            onClick={() => navigate("/products")}
            className="mt-4 bg-accent hover:bg-accent/90"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 flex items-center gap-4"
              >
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
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 h-fit">
            {isCheckingOut ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Complete Your Gift</h3>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <Input
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <Input
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Special Note (Optional)
                  </label>
                  <Textarea
                    placeholder="Add a special note for the family..."
                    value={formData.specialNote}
                    onChange={(e) =>
                      setFormData({ ...formData, specialNote: e.target.value })
                    }
                  />
                </div>
                <div className="py-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Total:</span>
                    <span className="text-accent font-bold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-accent hover:bg-accent/90"
                      onClick={handleCheckout}
                      disabled={!formData.firstName || !formData.lastName}
                    >
                      Confirm Gift
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsCheckingOut(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="text-accent font-bold">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full bg-accent hover:bg-accent/90"
                  onClick={() => setIsCheckingOut(true)}
                >
                  Proceed to Checkout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}