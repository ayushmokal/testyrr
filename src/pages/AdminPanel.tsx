import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BlogForm } from "@/components/admin/BlogForm";
import { ProductForm } from "@/components/admin/ProductForm";
import { BlogAnalytics } from "@/components/admin/BlogAnalytics";
import { BlogManager } from "@/components/admin/BlogManager";
import { ProductManager } from "@/components/admin/ProductManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folders, Smartphone } from "lucide-react";
import { type Category, categories } from "@/types/blog";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [productType, setProductType] = useState<'mobile' | 'laptop' | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/admin/login");
      return;
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setShowCategories(!showCategories);
                setShowProducts(false);
                setSelectedCategory(null);
                setProductType(null);
              }}
            >
              <Folders className="h-4 w-4" />
              Manage All Categories
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setShowProducts(!showProducts);
                setShowCategories(false);
                setSelectedCategory(null);
                setProductType(null);
              }}
            >
              <Smartphone className="h-4 w-4" />
              Manage Products
            </Button>
          </div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        
        {showCategories ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {selectedCategory ? `${selectedCategory} Category Management` : 'Category Management'}
              </h2>
              {selectedCategory ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                    Back to Categories
                  </Button>
                  <Button variant="outline" onClick={() => setShowCategories(false)}>
                    Back to Dashboard
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowCategories(false)}>
                  Back to Dashboard
                </Button>
              )}
            </div>
            
            {selectedCategory ? (
              <BlogManager selectedCategory={selectedCategory} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(categories) as Category[]).map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className="h-24 text-lg font-semibold"
                    onClick={() => setSelectedCategory(category)}
                  >
                    Manage {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : showProducts ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {productType ? `${productType === 'mobile' ? 'Mobile Phones' : 'Laptops'} Management` : 'Product Management'}
              </h2>
              {productType ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setProductType(null)}>
                    Back to Products
                  </Button>
                  <Button variant="outline" onClick={() => setShowProducts(false)}>
                    Back to Dashboard
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowProducts(false)}>
                  Back to Dashboard
                </Button>
              )}
            </div>
            
            {productType ? (
              <ProductManager productType={productType} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 text-lg font-semibold"
                  onClick={() => setProductType('mobile')}
                >
                  Manage Mobile Phones
                </Button>
                <Button
                  variant="outline"
                  className="h-24 text-lg font-semibold"
                  onClick={() => setProductType('laptop')}
                >
                  Manage Laptops
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="create-blog">Create Blog</TabsTrigger>
              <TabsTrigger value="add-product">Add Product</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-4">
              <h2 className="text-xl font-semibold">Blog Analytics</h2>
              <BlogAnalytics />
            </TabsContent>

            <TabsContent value="create-blog" className="space-y-4">
              <h2 className="text-xl font-semibold">Create New Blog Post</h2>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <BlogForm />
              </div>
            </TabsContent>

            <TabsContent value="add-product" className="space-y-4">
              <h2 className="text-xl font-semibold">Add New Product</h2>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <ProductForm />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}