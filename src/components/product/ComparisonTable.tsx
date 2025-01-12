import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MobileProduct, LaptopProduct } from "@/types/product";

interface ComparisonTableProps {
  selectedProducts: (MobileProduct | LaptopProduct)[];
  currentProduct: MobileProduct | LaptopProduct;
  type: 'mobile' | 'laptop';
  onRemove: (productId: string) => void;
}

export function ComparisonTable({ selectedProducts, currentProduct, type, onRemove }: ComparisonTableProps) {
  const baseSpecs = [
    { title: "Price", key: "price" },
    { title: "Brand", key: "brand" },
    { title: "Model", key: "model_name" },
    { title: "Display", key: "display_specs" },
    { title: "Processor", key: "processor" },
    { title: "RAM", key: "ram" },
    { title: "Storage", key: "storage" },
    { title: "Battery", key: "battery" },
    { title: "OS", key: "os" },
    { title: "Color", key: "color" },
  ];

  const mobileSpecs = [
    ...baseSpecs,
    { title: "Camera", key: "camera" },
    { title: "Chipset", key: "chipset" },
  ];

  const laptopSpecs = [
    ...baseSpecs,
    { title: "Graphics", key: "graphics" },
    { title: "Ports", key: "ports" },
  ];

  const specs = type === 'laptop' ? laptopSpecs : mobileSpecs;
  const displayProducts = selectedProducts.slice(1, 3);

  return (
    <div className="mt-6">
      <div className="mt-8">
        {specs.map((spec) => (
          <div key={spec.key}>
            <div className="grid grid-cols-4 gap-4 py-3">
              <div className="font-medium text-gray-700">{spec.title}</div>
              <div className="text-gray-600">
                {spec.key === 'price' 
                  ? `₹${currentProduct[spec.key]?.toLocaleString()}` 
                  : currentProduct[spec.key as keyof typeof currentProduct]?.toString() || 'N/A'}
              </div>
              {displayProducts.map((product) => (
                <div key={`${product.id}-${spec.key}`} className="text-gray-600">
                  {spec.key === 'price' 
                    ? `₹${product[spec.key]?.toLocaleString()}` 
                    : product[spec.key as keyof typeof product]?.toString() || 'N/A'}
                </div>
              ))}
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}