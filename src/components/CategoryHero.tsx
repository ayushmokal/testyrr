import { BlogFormData } from "@/types/blog";
import { Link, useLocation } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CategoryHeroProps {
  featuredArticle: BlogFormData | undefined;
  gridArticles: BlogFormData[];
}

export function CategoryHero({ featuredArticle, gridArticles }: CategoryHeroProps) {
  const location = useLocation();
  const isGadgetsPage = location.pathname === "/gadgets";
  
  if (!featuredArticle || isGadgetsPage) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 animate-fadeIn">
      {/* Main Featured Article - 75% width */}
      <div className="lg:col-span-3 bg-white rounded-xl overflow-hidden group">
        <Link to={`/article/${featuredArticle.slug}`} className="block">
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16/9}>
              <img
                src={featuredArticle.image_url}
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>
          </div>
          <div className="p-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold hover:text-primary transition-colors">
              {featuredArticle.title}
            </h2>
          </div>
        </Link>
      </div>

      {/* Side Articles Column - 25% width */}
      <div className="lg:col-span-1 space-y-6">
        {gridArticles.slice(0, 2).map((article) => (
          <div key={article.slug} className="bg-white rounded-xl overflow-hidden group">
            <Link to={`/article/${article.slug}`} className="block">
              <div className="relative overflow-hidden">
                <AspectRatio ratio={16/9}>
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </AspectRatio>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium hover:text-primary transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}