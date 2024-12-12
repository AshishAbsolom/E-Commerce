import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CheckoutDialogProps {
  items: CartItem[];
  totalPrice: number;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog = ({ items, totalPrice, onSuccess, open, onOpenChange }: CheckoutDialogProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    specialNote: "",
  });

  const handleCheckout = async () => {
    try {
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

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 sm:p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center">Complete Your Gift</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-6">
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
          <div className="pt-6 border-t">
            <div className="flex justify-between mb-6">
              <span className="font-medium">Total:</span>
              <span className="text-accent font-bold">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-base sm:text-lg py-6 rounded-xl"
              onClick={handleCheckout}
              disabled={!formData.firstName || !formData.lastName}
            >
              Confirm Gift
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};