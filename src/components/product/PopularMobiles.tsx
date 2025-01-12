import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function PopularMobiles() {
  const { toast } = useToast();

  const { data: popularMobiles = [], error } = useQuery({
    queryKey: ['popular-mobiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mobile_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mobiles:', error);
        throw error;
      }
      
      return data || [];
    },
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load mobile products. Please try again.",
        });
      }
    }
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load mobile products. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Popular Mobiles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {popularMobiles.map((mobile) => (
          <Link 
            key={mobile.id} 
            to={`/product/${mobile.id}?type=mobile`}
            className="group"
          >
            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200 h-full">
              <div className="aspect-w-4 aspect-h-3 mb-6">
                <img
                  src={mobile.image_url || "/placeholder.svg"}
                  alt={mobile.name}
                  className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary/90 transition-colors">
                  {mobile.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-primary">₹{mobile.price.toLocaleString()}</span>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p className="line-clamp-1">
                    Display: {mobile.display_specs}
                  </p>
                  <p className="line-clamp-1">
                    Camera: {mobile.camera}
                  </p>
                  <p className="line-clamp-1">
                    Battery: {mobile.battery}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}