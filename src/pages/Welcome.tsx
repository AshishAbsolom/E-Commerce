import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Baby } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-white p-4 text-center">
      {/* Wrapper to move content higher */}
      <div className="flex flex-col items-center justify-center -mt-16">
        {/* Icon */}
        <Baby className="w-20 h-20 text-blue-500 mb-8" />

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-snug">
          Welcome to
          <div className="text-blue-500 mt-2">Alana's Baby Registry</div>
        </h1>

        {/* Button */}
        <Link to="/Alana" className="mt-10">
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            Shop Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
