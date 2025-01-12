import { BlogFormData } from "@/types/blog";
import { ArticleCard } from "@/components/ArticleCard";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FeaturedArticlesGridProps {
  articles: BlogFormData[];
}

export function FeaturedArticlesGrid({ articles }: FeaturedArticlesGridProps) {
  if (!articles.length) return null;

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main Featured Article - 50% width */}
      <div className="col-span-12 lg:col-span-6">
        <Link to={`/article/${articles[0].slug}`} className="block group">
          <div className="relative overflow-hidden rounded-t-xl">
            <AspectRatio ratio={16/9} className="mb-4">
              <img
                src={articles[0].image_url || '/placeholder.svg'}
                alt={articles[0].title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-b-[30px]"
              />
            </AspectRatio>
            <div className="flex flex-col justify-between h-[120px]">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-primary/90 transition-colors line-clamp-2">
                {articles[0].title}
              </h2>
              <p className="mt-2 text-gray-600 line-clamp-2">
                {articles[0].meta_description || ''}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Second Article - 50% width */}
      {articles[1] && (
        <div className="col-span-12 lg:col-span-6">
          <Link to={`/article/${articles[1].slug}`} className="block group">
            <div className="relative overflow-hidden rounded-t-xl">
              <AspectRatio ratio={16/9} className="mb-4">
                <img
                  src={articles[1].image_url || '/placeholder.svg'}
                  alt={articles[1].title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-b-[30px]"
                />
              </AspectRatio>
              <div className="flex flex-col justify-between h-[120px]">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-primary/90 transition-colors line-clamp-2">
                  {articles[1].title}
                </h2>
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {articles[1].meta_description || ''}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Remaining Articles */}
      {articles.slice(2).map((article) => (
        <div key={article.slug} className="col-span-12 sm:col-span-6 lg:col-span-3">
          <ArticleCard
            title={article.title}
            image={article.image_url || ''}
            category={article.category}
            slug={article.slug}
          />
        </div>
      ))}
    </div>
  );
}