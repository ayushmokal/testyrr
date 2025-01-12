import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductImage } from "./ProductImage";
import { ProductSpecifications } from "./ProductSpecifications";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  display_specs: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  camera?: string;
  os?: string;
  chipset?: string;
  color?: string;
  graphics?: string;
  ports?: string;
  model_name?: string;
  resolution?: string;
  screen_size?: string;
  charging_specs?: string;
  gallery_images?: string[];
}

interface ProductDetailsDialogProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsDialog({ product, onClose }: ProductDetailsDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!product) return null;

  const allImages = [product.image_url || "/placeholder.svg", ...(product.gallery_images || [])].filter(Boolean);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            View detailed information about {product.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="w-full space-y-4">
            <div className="relative aspect-square">
              <img
                src={allImages[currentIndex]}
                alt={`${product.name} - View ${currentIndex + 1}`}
                className="object-contain w-full h-full p-4 border rounded-lg bg-white"
              />
              {allImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 flex-shrink-0 rounded-lg border overflow-hidden cursor-pointer ${
                      index === currentIndex ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full">
            <ProductSpecifications product={product} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}