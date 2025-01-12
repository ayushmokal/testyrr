import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { type Category, categories } from "@/types/blog";
import { CategorySection } from "./CategorySection";

interface BlogManagerProps {
  selectedCategory?: Category;
}

export function BlogManager({ selectedCategory }: BlogManagerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: blogs, refetch } = useQuery({
    queryKey: ['blogs', selectedCategory],
    queryFn: async () => {
      console.log('Fetching blogs...', selectedCategory ? `for category: ${selectedCategory}` : 'all categories');
      const query = supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedCategory) {
        query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blogs:', error);
        throw error;
      }
      
      console.log('Blogs fetched successfully:', data);
      return data || [];
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete blog post",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Blog post deleted successfully",
    });
    refetch();
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  const togglePopular = async (id: string, currentValue: boolean) => {
    console.log('Toggling homepage popular status:', id, currentValue);
    
    const { error } = await supabase
      .from('blogs')
      .update({ popular: !currentValue })
      .eq('id', id);

    if (error) {
      console.error('Error updating popular status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Blog status updated successfully",
    });
    refetch();
  };

  const toggleCategoryPopular = async (id: string, currentValue: boolean) => {
    const blog = blogs?.find(b => b.id === id);
    if (!blog) return;

    const updateField = `popular_in_${blog.category.toLowerCase()}`;
    
    const { error } = await supabase
      .from('blogs')
      .update({ [updateField]: !currentValue })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update blog status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Blog status updated successfully",
    });
    refetch();
  };

  const toggleFeatured = async (id: string, currentValue: boolean, category: string, isHomepage = false) => {
    // If toggling homepage featured status
    if (isHomepage) {
      // If trying to feature a blog, check the total count first
      if (!currentValue) {
        const { data: featuredCount } = await supabase
          .from('blogs')
          .select('id', { count: 'exact' })
          .eq('featured', true);

        if (featuredCount && featuredCount.length >= 6) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Maximum of 6 featured blogs allowed on homepage",
          });
          return;
        }
      }

      const { error } = await supabase
        .from('blogs')
        .update({ featured: !currentValue })
        .eq('id', id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update homepage featured status",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Homepage featured status updated successfully",
      });
      refetch();
      return;
    }

    // If toggling category featured status
    // Check featured count for the category
    if (!currentValue) {
      const { data: featuredCount } = await supabase
        .from('blogs')
        .select('id', { count: 'exact' })
        .eq('category', category)
        .eq('featured_in_category', true);

      if (featuredCount && featuredCount.length >= 7) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Maximum of 7 featured blogs allowed for ${category} category`,
        });
        return;
      }
    }

    const { error } = await supabase
      .from('blogs')
      .update({ featured_in_category: !currentValue })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update featured status",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Featured status updated successfully",
    });
    refetch();
  };

  if (!blogs) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading blogs...</p>
      </div>
    );
  }

  const categoriesToShow = selectedCategory ? [selectedCategory] : Object.keys(categories) as Category[];

  return (
    <div className="space-y-4">
      {categoriesToShow.map((category) => {
        const categoryBlogs = selectedCategory ? blogs : blogs.filter((blog) => blog.category === category);
        console.log(`Filtered blogs for ${category}:`, categoryBlogs);
        
        return (
          <CategorySection
            key={category}
            category={category}
            blogs={categoryBlogs}
            onToggleFeatured={toggleFeatured}
            onTogglePopular={togglePopular}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}