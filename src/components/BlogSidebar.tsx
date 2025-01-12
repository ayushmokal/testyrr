import { useState } from "react";
import { Button } from "./ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

interface BlogItem {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
  slug: string;
}

export function BlogSidebar() {
  const [selectedCategory, setSelectedCategory] = useState("TECH");

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useInfiniteQuery({
    queryKey: ['sidebar-items', selectedCategory],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching sidebar items for:', selectedCategory, 'page:', pageParam);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', selectedCategory)
        .order('created_at', { ascending: false })
        .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);
      
      if (error) {
        console.error('Error fetching sidebar items:', error);
        throw error;
      }
      
      return data || [];
    },
    getNextPageParam: (lastPage: BlogItem[], allPages: BlogItem[][]) => {
      return lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  const mainCategories = ["TECH", "GAMES", "ENTERTAINMENT", "STOCKS"];

  const renderBlogItem = (item: BlogItem) => (
    <Link 
      to={`/article/${item.slug}`}
      key={item.id} 
      className="flex gap-4 p-4 hover:bg-gray-50"
    >
      <img
        src={item.image_url || "/placeholder.svg"}
        alt={item.title}
        className="w-32 h-24 object-cover rounded" // Updated from w-24 h-16 to w-32 h-24
      />
      <div className="flex-1">
        <h4 className="font-medium line-clamp-2 text-base">
          {item.title}
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </Link>
  );

  const renderAdvertisement = (key: number) => (
    <div key={`ad-${key}`} className="p-4 bg-gray-50">
      <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Advertisement</span>
      </div>
    </div>
  );

  return (
    <aside className="space-y-8">
      <div className="rounded-lg border-2 border-emerald-600">
        {/* Header */}
        <div className="bg-emerald-600 text-white p-3">
          <h2 className="text-xl font-bold">Upcomings</h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap border-b border-emerald-600">
          {mainCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedCategory === category 
                ? "border-emerald-600 text-emerald-600" 
                : "border-transparent"
              }`}
              onClick={() => {
                console.log('Switching to category:', category);
                setSelectedCategory(category);
              }}
            >
              {category.split(' ').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="divide-y">
          {data?.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {/* First 5 blog posts */}
              {page.slice(0, 5).map(renderBlogItem)}
              
              {/* First Advertisement after 5 posts */}
              {page.length > 0 && renderAdvertisement(pageIndex * 2)}
              
              {/* Next 5 blog posts */}
              {page.slice(5).map(renderBlogItem)}
              
              {/* Second Advertisement after next 5 posts */}
              {page.length > 5 && renderAdvertisement(pageIndex * 2 + 1)}
            </div>
          ))}

          {/* Load More Button */}
          {hasNextPage && (
            <div className="p-4 text-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {data?.pages[0]?.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No upcoming items found
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}