import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThankYouDialog = ({ open, onOpenChange }: ThankYouDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      // Try multiple methods to close the window
      window.open('', '_self')?.close();
      window.close();
      // If above methods fail, try closing the tab
      window.open('', '_self');
      window.top?.close();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-lg mx-auto p-6 sm:p-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl text-center font-bold">Thank You for Your Gift!</DialogTitle>
        </DialogHeader>
        <div className="space-y-8 mt-6">
          <p className="text-center text-gray-600 text-lg sm:text-xl leading-relaxed">
            Your order has been placed successfully!
          </p>
          <Button 
            onClick={handleClose}
            className="w-full bg-accent hover:bg-accent/90 text-lg sm:text-xl py-8 rounded-xl"
          >
            Close Window
            <X className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};