import { ProductSpecifications } from "@/components/admin/ProductSpecifications";
import { ProductReviewCard } from "./ProductReviewCard";
import { Button } from "@/components/ui/button";
import { ProductKeySpecs } from "./ProductKeySpecs";
import { ProductComments } from "./ProductComments";
import { PopularMobiles } from "./PopularMobiles";
import type { LaptopProduct, MobileProduct } from "@/types/product";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductRatingSystem } from "./ProductRatingSystem";
import { ProductReview } from "./ProductReview";
import { ProductVariantSelector } from "./ProductVariantSelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const getBrandWebsite = (brand: string): string => {
  const brandWebsites: { [key: string]: string } = {
    'Apple': 'https://www.apple.com',
    'Samsung': 'https://www.samsung.com',
    'OnePlus': 'https://www.oneplus.com',
    'Xiaomi': 'https://www.mi.com',
    'ASUS': 'https://www.asus.com',
    'Dell': 'https://www.dell.com',
    'HP': 'https://www.hp.com',
    'Lenovo': 'https://www.lenovo.com',
  };
  return brandWebsites[brand] || '#';
};

interface ProductContentProps {
  product: LaptopProduct | MobileProduct;
  type: 'mobile' | 'laptop';
  activeSection: string;
}

export function ProductContent({ product: initialProduct, type }: ProductContentProps) {
  const [currentProduct, setCurrentProduct] = useState(initialProduct);
  const navigate = useNavigate();
  const isLaptop = type === 'laptop';
  const isMobile = type === 'mobile';
  const brandWebsite = getBrandWebsite(currentProduct.brand || '');

  const handleVariantChange = (variant: LaptopProduct | MobileProduct) => {
    setCurrentProduct(variant);
  };

  const handleCompare = () => {
    navigate('/comparison', {
      state: {
        product: currentProduct,
        type,
      },
    });
  };

  // Fetch product variants
  const { data: variants } = useQuery({
    queryKey: ['product-variants', currentProduct.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(type === 'laptop' ? 'laptops' : 'mobile_products')
        .select('*')
        .eq('name', currentProduct.name)
        .eq('brand', currentProduct.brand);

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="flex-1 space-y-16">
      {/* Overview Section */}
      <section id="overview" className="scroll-mt-24">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-bold">{currentProduct.name}</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Released January 2024</span>
                  </div>
                  <span>•</span>
                  <a 
                    href={brandWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    About {currentProduct.brand}
                  </a>
                </div>
              </div>
              <Button 
                variant="default" 
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleCompare}
              >
                Compare
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">₹{currentProduct.price.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">(onwards)</span>
              </div>
              <a href="#variants" className="text-sm text-primary hover:underline">See All Variants</a>
            </div>

            {isMobile && (
              <ProductVariantSelector
                product={currentProduct}
                type={type}
                onVariantChange={handleVariantChange}
              />
            )}

            <ProductKeySpecs
              type={type}
              screenSize={currentProduct.display_specs}
              camera={isMobile ? (currentProduct as MobileProduct).camera : undefined}
              processor={currentProduct.processor}
              battery={currentProduct.battery}
              graphics={isLaptop ? (currentProduct as LaptopProduct).graphics : undefined}
            />
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section id="review" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">Expert Review</h2>
        <ProductReview productId={currentProduct.id} />
      </section>

      {/* User Reviews Section */}
      <section id="user-reviews" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
        <ProductRatingSystem productId={currentProduct.id} />
        <div className="mt-8">
          <ProductComments productId={currentProduct.id} />
        </div>
      </section>

      {/* Specifications Section */}
      <section id="specifications" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">Full Specification</h2>
        <ProductSpecifications product={currentProduct} />
      </section>

      {/* Compare Section */}
      <section id="comparison" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">Compare Products</h2>
        <div className="bg-white rounded-lg p-8 border shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 bg-gray-50 p-4 rounded-lg">
              <img 
                src={currentProduct.image_url || "/placeholder.svg"} 
                alt={currentProduct.name} 
                className="w-32 h-32 object-contain"
              />
              <h3 className="text-sm font-medium text-center mt-2">{currentProduct.name}</h3>
            </div>
            <div className="flex-grow space-y-4">
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-gray-900">Add devices to compare</h4>
                <p className="text-gray-600">Compare {currentProduct.name} with other devices to find the best match for you</p>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="default" 
                  className="bg-teal-600 hover:bg-teal-700 px-6 py-2 text-base font-medium transition-colors duration-200"
                  onClick={handleCompare}
                >
                  Compare Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Variants Section */}
      <section id="variants" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6">Available Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants?.map((variant) => (
            <div key={variant.id} className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">{variant.name}</h3>
              <p className="text-sm text-muted-foreground">
                {variant.storage} • {variant.color}
              </p>
              <p className="font-medium">₹{variant.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {isMobile && <PopularMobiles />}
    </div>
  );
}
