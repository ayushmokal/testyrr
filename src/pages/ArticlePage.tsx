import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlogSidebar } from "@/components/BlogSidebar";
import type { BlogFormData } from "@/types/blog";
import { useToast } from "@/components/ui/use-toast";
import { ArticleContent } from "@/components/article/ArticleContent";
import { NextArticles } from "@/components/article/NextArticles";
import { Button } from "@/components/ui/button";

export default function ArticlePage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogFormData | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const articlesPerPage = 6;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Article not found",
          description: "The article you're looking for doesn't exist.",
        });
        navigate("/");
        return;
      }

      await supabase.rpc('increment_view_count', { blog_id: data.id });
      setBlog(data);
      fetchRelatedArticles(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load the article. Please try again later.",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedArticles = async (currentBlog: BlogFormData) => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("category", currentBlog.category)
        .neq("id", currentBlog.id)
        .order("created_at", { ascending: false })
        .range(0, articlesPerPage - 1);

      if (error) throw error;
      setRelatedArticles(data || []);
    } catch (error) {
      console.error("Error fetching related articles:", error);
      toast({
        variant: "destructive",
        title: "Warning",
        description: "Unable to load related articles at this time.",
      });
    }
  };

  const loadMoreArticles = async () => {
    if (!blog) return;
    
    setIsLoadingMore(true);
    try {
      const start = page * articlesPerPage;
      const end = start + articlesPerPage - 1;
      
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("category", blog.category)
        .neq("id", blog.id)
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;
      
      if (data) {
        setRelatedArticles(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load more articles. Please try again.",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <ArticleContent blog={blog} />
            
            {relatedArticles.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">More from {blog.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((article) => (
                    <div 
                      key={article.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/article/${article.slug}`)}
                    >
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={article.image_url || '/placeholder.svg'}
                          alt={article.title}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-2 text-lg font-semibold group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  ))}
                </div>
                
                {relatedArticles.length >= articlesPerPage && (
                  <div className="flex justify-center mt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={loadMoreArticles}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? "Loading..." : "Load More Articles"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-4">
            <BlogSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}