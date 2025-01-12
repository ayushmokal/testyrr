import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  mainImage: string | null;
  productName: string;
  galleryImages?: string[] | null;
}

export function ProductGallery({ mainImage, productName, galleryImages = [] }: ProductGalleryProps) {
  const allImages = [mainImage || "/placeholder.svg", ...(galleryImages || [])].filter(Boolean);
  const [selectedImage, setSelectedImage] = useState(allImages[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    setSelectedImage(allImages[currentIndex === 0 ? allImages.length - 1 : currentIndex - 1]);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    setSelectedImage(allImages[currentIndex === allImages.length - 1 ? 0 : currentIndex + 1]);
  };

  // Ensure the image URL is properly formatted
  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
  };

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-lg border bg-white">
        <img
          src={formatImageUrl(selectedImage)}
          alt={`${productName} - View ${currentIndex + 1}`}
          className="object-contain w-full h-full p-4"
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
              onClick={() => {
                setSelectedImage(image);
                setCurrentIndex(index);
              }}
            >
              <img
                src={formatImageUrl(image)}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-contain p-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}