import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useCart } from "../store/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/components/cart/CartItem";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialNote: "",
  });

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    try {
      setIsSubmitting(true);
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

      const { error: updateError } = await supabase
        .from("products")
        .update({ is_gifted: true })
        .in(
          "id",
          items.map((item) => item.id)
        );

      if (updateError) throw updateError;

      clearCart();
      console.log('Navigating to thank you page');
      navigate('/thank-you');
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16 text-center">
          <p className="text-gray-600">Your cart is empty</p>
          <Button
            onClick={() => navigate("/Alana")}
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
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="text-accent font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold">Complete Your Gift</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="rounded-xl"
                  />
                </div>
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
                  className="min-h-[100px] rounded-xl"
                />
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90 py-6 text-lg"
                onClick={handleCheckout}
                disabled={!formData.firstName || !formData.lastName || isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Gift"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}