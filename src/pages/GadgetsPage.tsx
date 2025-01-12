import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/types/blog";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";
import { MobileProductList } from "@/components/product/MobileProductList";
import { LaptopProductGrid } from "@/components/product/LaptopProductGrid";
import { BlogSidebar } from "@/components/BlogSidebar";
import type { MobileProduct, LaptopProduct } from "@/types/product";

const ITEMS_PER_PAGE = 8;

export default function GadgetsPage() {
  const [subcategory, setSubcategory] = useState<"MOBILE" | "LAPTOPS">("MOBILE");

  // Query for category-specific featured articles
  const { data: featuredArticles } = useInfiniteQuery({
    queryKey: ['gadgets-featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'GADGETS')
        .eq('featured_in_category', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    initialPageParam: 0,
    getNextPageParam: () => null, // No pagination for featured articles
  });

  // Query for all gadgets articles
  const { data: articles } = useInfiniteQuery({
    queryKey: ['gadgets-articles', subcategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'GADGETS')
        .eq('subcategory', subcategory)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    initialPageParam: 0,
    getNextPageParam: () => null, // No pagination for articles
  });

  // Infinite query for mobile products
  const {
    data: mobileData,
    fetchNextPage: fetchNextMobile,
    hasNextPage: hasNextMobile,
    isFetchingNextPage: isFetchingNextMobile
  } = useInfiniteQuery({
    queryKey: ['infinite-mobiles'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error, count } = await supabase
        .from('mobile_products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      return {
        data: data || [],
        nextPage: data && data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
        totalCount: count
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  // Infinite query for laptops
  const {
    data: laptopData,
    fetchNextPage: fetchNextLaptop,
    hasNextPage: hasNextLaptop,
    isFetchingNextPage: isFetchingNextLaptop
  } = useInfiniteQuery({
    queryKey: ['infinite-laptops'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      const { data, error, count } = await supabase
        .from('laptops')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      return {
        data: data || [],
        nextPage: data && data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
        totalCount: count
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  // Flatten the pages data
  const mobileProducts = mobileData?.pages.flatMap(page => page.data) || [];
  const laptops = laptopData?.pages.flatMap(page => page.data) || [];

  const ProductGrids = () => (
    <div className="lg:col-span-8">
      {subcategory === "MOBILE" && (
        <MobileProductList 
          products={mobileProducts}
          onLoadMore={fetchNextMobile}
          hasMore={hasNextMobile}
          isLoading={isFetchingNextMobile}
        />
      )}
      {subcategory === "LAPTOPS" && (
        <LaptopProductGrid 
          products={laptops}
          onLoadMore={fetchNextLaptop}
          hasMore={hasNextLaptop}
          isLoading={isFetchingNextLaptop}
        />
      )}
    </div>
  );

  return (
    <CategoryPageLayout
      title="Gadgets"
      category="GADGETS"
      articles={articles?.pages.flatMap(page => page) || []}
      featuredArticles={featuredArticles?.pages.flatMap(page => page) || []}
      subcategories={categories.GADGETS}
      selectedSubcategory={subcategory}
      onSubcategoryChange={(sub) => setSubcategory(sub as typeof subcategory)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ProductGrids />
        <div className="lg:col-span-4">
          <BlogSidebar />
        </div>
      </div>
    </CategoryPageLayout>
  );
}