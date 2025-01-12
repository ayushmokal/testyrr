import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductImage } from "./ProductImage";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onAddReview: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({
  products,
  onView,
  onEdit,
  onAddReview,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="w-[300px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.image_url && (
                  <div className="w-20 h-20">
                    <ProductImage imageUrl={product.image_url} productName={product.name} />
                  </div>
                )}
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>₹{product.price.toLocaleString()}</TableCell>
              <TableCell>
                <div className="w-[300px] overflow-x-auto">
                  <div className="flex items-center gap-2 p-1 pr-4 min-w-max">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(product)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAddReview(product)}
                    >
                      Add Review
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}