import { useEffect } from 'react';

export default function ThankYou() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.close();
      // Fallback - redirect to products
      window.location.href = '/products';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Gift!</h1>
        <p className="text-gray-600">
          Your generous gift means a lot to us. We appreciate your support!
        </p>
        <p className="text-sm text-gray-500 mt-8">
          This window will close automatically...
        </p>
      </div>
    </div>
  );
} 