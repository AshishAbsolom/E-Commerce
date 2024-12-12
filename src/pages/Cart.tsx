import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { useCart } from "../store/CartContext";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/cart/CartItem";
import { CheckoutDialog } from "@/components/cart/CheckoutDialog";

export default function Cart() {
  const { items, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handleOrderSuccess = () => {
    setIsCheckoutOpen(false);
    const thankYouWindow = window.open('', '_blank', 'width=800,height=600');
    if (thankYouWindow) {
      thankYouWindow.document.write(`
        <html>
          <head>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
              body {
                margin: 0;
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .container {
                background: white;
                padding: 4rem;
                border-radius: 2rem;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 600px;
                animation: fadeIn 0.5s ease-out;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              h1 {
                color: #0f172a;
                font-size: 2.5rem;
                margin-bottom: 2rem;
                font-weight: 700;
              }
              p {
                color: #475569;
                font-size: 1.5rem;
                line-height: 1.6;
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Thank You for Your Gift!</h1>
              <p>
                Your order has been placed successfully!
              </p>
            </div>
          </body>
        </html>
      `);
      clearCart();
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
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 h-fit">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="text-accent font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-accent hover:bg-accent/90"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CheckoutDialog
        items={items}
        totalPrice={totalPrice}
        onSuccess={handleOrderSuccess}
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
      />
    </>
  );
}