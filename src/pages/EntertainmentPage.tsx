import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/types/blog";
import { CategoryPageLayout } from "@/components/CategoryPageLayout";

export default function EntertainmentPage() {
  const [subcategory, setSubcategory] = useState<"ALL" | string>("ALL");

  const { data: featuredArticles = [] } = useQuery({
    queryKey: ['entertainment-featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'ENTERTAINMENT')
        .eq('featured_in_category', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['entertainment-articles', subcategory],
    queryFn: async () => {
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('category', 'ENTERTAINMENT')
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
      title="Entertainment"
      category="ENTERTAINMENT"
      articles={articles}
      featuredArticles={featuredArticles}
      subcategories={categories.ENTERTAINMENT}
      selectedSubcategory={subcategory}
      onSubcategoryChange={setSubcategory}
    />
  );
}