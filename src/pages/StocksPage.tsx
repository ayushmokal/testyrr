import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/types/blog";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";

export default function StocksPage() {
  const [subcategory, setSubcategory] = useState<"ALL" | string>("ALL");

  const { data: featuredArticles = [] } = useQuery({
    queryKey: ['stocks-featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'STOCKS')
        .eq('featured_in_category', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['stocks-articles', subcategory],
    queryFn: async () => {
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('category', 'STOCKS')
        .order('created_at', { ascending: false });
      
      if (subcategory !== "ALL") {
        query = query.eq('subcategory', subcategory);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <CategoryPageLayout
      title="Stocks"
      category="STOCKS"
      articles={articles}
      featuredArticles={featuredArticles}
      subcategories={categories.STOCKS}
      selectedSubcategory={subcategory}
      onSubcategoryChange={setSubcategory}
    />
  );
}