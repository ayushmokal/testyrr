import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SpecificationItemProps {
  label: string;
  value: string | number;
}

function SpecificationItem({ label, value }: SpecificationItemProps) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

interface SpecificationSectionProps {
  title: string;
  specs: { label: string; value: string | number }[];
}

function SpecificationSection({ title, specs }: SpecificationSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">{title}</h3>
      {specs.map((spec, index) => (
        <SpecificationItem key={index} {...spec} />
      ))}
      <Separator className="my-4" />
    </div>
  );
}

interface ProductSpecificationsProps {
  product: {
    name: string;
    brand: string;
    price: number;
    display_specs: string;
    processor: string;
    ram: string;
    storage: string;
    camera?: string;
    battery: string;
    os?: string;
    [key: string]: any;
  };
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SpecificationSection
          title="Basic Information"
          specs={[
            { label: "Brand", value: product.brand },
            { label: "Model", value: product.name },
            { label: "Price", value: `₹${product.price.toLocaleString()}` },
          ]}
        />
        
        <SpecificationSection
          title="Display & Performance"
          specs={[
            { label: "Display", value: product.display_specs },
            { label: "Processor", value: product.processor },
            { label: "RAM", value: product.ram },
            { label: "Storage", value: product.storage },
          ]}
        />

        {product.camera && (
          <SpecificationSection
            title="Camera"
            specs={[{ label: "Camera Setup", value: product.camera }]}
          />
        )}

        <SpecificationSection
          title="Battery & OS"
          specs={[
            { label: "Battery", value: product.battery },
            ...(product.os ? [{ label: "Operating System", value: product.os }] : []),
          ]}
        />

        {product.chipset && (
          <SpecificationSection
            title="Additional Specifications"
            specs={[
              { label: "Chipset", value: product.chipset },
              ...(product.color ? [{ label: "Color", value: product.color }] : []),
            ]}
          />
        )}
      </CardContent>
    </Card>
  );
}