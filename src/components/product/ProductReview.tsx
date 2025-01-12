import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductReviewProps {
  productId: string;
}

interface ExpertReview {
  id: string;
  product_id: string;
  rating: number;
  date: string;
  author: string;
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
}

export function ProductReview({ productId }: ProductReviewProps) {
  const { data: review, isLoading } = useQuery({
    queryKey: ['expert-review', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_reviews')
        .select('*')
        .eq('product_id', productId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching expert review:', error);
        return null;
      }

      return data as ExpertReview | null;
    },
  });

  if (isLoading) {
    return <div>Loading expert review...</div>;
  }

  if (!review) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No expert review available for this product yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {new Date(review.date).toLocaleDateString()} by {review.author}
          </p>
          <div className="mt-1">
            <span className="text-4xl font-bold">{review.rating}</span>
            <span className="text-gray-500">/10</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700">{review.summary}</p>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-green-600 mb-4">PROS</h4>
          <ul className="space-y-2">
            {review.pros.map((pro, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-green-600">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-600 mb-4">CONS</h4>
          <ul className="space-y-2">
            {review.cons.map((con, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-red-600">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">VERDICT</h4>
        <p className="text-gray-700">{review.verdict}</p>
      </div>
    </div>
  );
}