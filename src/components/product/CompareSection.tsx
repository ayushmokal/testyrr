import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductComparisonCard } from "./ProductComparisonCard";
import { ComparisonTable } from "./ComparisonTable";
import { MobileProduct, LaptopProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CompareSectionProps {
  currentProduct: MobileProduct | LaptopProduct;
  type: 'mobile' | 'laptop';
}

export function CompareSection({ currentProduct, type }: CompareSectionProps) {
  const [selectedProducts, setSelectedProducts] = useState<(MobileProduct | LaptopProduct)[]>([currentProduct]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: products = [] } = useQuery({
    queryKey: ['products', type],
    queryFn: async () => {
      const tableName = type === 'laptop' ? 'laptops' : 'mobile_products';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .neq('id', currentProduct.id)
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const addToCompare = (product: MobileProduct | LaptopProduct) => {
    if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      toast({
        title: "Maximum products reached",
        description: "You can compare up to 3 products at a time",
      });
    }
  };

  const removeFromCompare = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleCompare = () => {
    if (selectedProducts.length > 1) {
      navigate('/comparison', {
        state: {
          products: selectedProducts,
          type,
        },
        replace: true
      });
    } else {
      toast({
        title: "Add more products",
        description: "Please select at least one more product to compare",
      });
    }
  };

  return (
    <div className="space-y-6">
      {selectedProducts.length < 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Add Products to Compare</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductComparisonCard
                key={product.id}
                product={product}
                onCompare={addToCompare}
                isSelected={selectedProducts.some(p => p.id === product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <>
          <ComparisonTable
            selectedProducts={selectedProducts}
            currentProduct={currentProduct}
            type={type}
            onRemove={removeFromCompare}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCompare}
              className="bg-teal-600 hover:bg-teal-700"
              disabled={selectedProducts.length < 2}
            >
              Compare Products
            </Button>
          </div>
        </>
      )}
    </div>
  );
}