import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ArticleCardProps {
  title: string;
  image: string;
  category: string;
  slug: string;
  featured?: boolean;
  mainFeatured?: boolean;
}

export function ArticleCard({ 
  title, 
  image, 
  category, 
  slug, 
  featured = false,
  mainFeatured = false 
}: ArticleCardProps) {
  return (
    <div className={cn(
      "group",
      mainFeatured ? "lg:col-span-3" : featured ? "lg:col-span-2" : "lg:col-span-1",
      "animate-fadeIn"
    )}>
      <Link
        to={`/article/${slug}`}
        className="block overflow-hidden bg-white rounded-xl transition-all duration-300 hover:shadow-lg"
      >
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16/9}>
            <img
              src={image || '/placeholder.svg'}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        </div>
      </Link>
      <Link 
        to={`/article/${slug}`}
        className="block mt-3 hover:text-primary transition-colors"
      >
        <h3 className={cn(
          "font-bold leading-tight",
          mainFeatured ? "text-2xl md:text-3xl" : featured ? "text-xl md:text-2xl" : "text-lg"
        )}>
          {title}
        </h3>
      </Link>
    </div>
  );
}