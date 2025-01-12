import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expertReviewSchema, type ExpertReviewFormData } from "@/schemas/productSchemas";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useExpertReview(productId: string, onSuccess?: () => void) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pros, setPros] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);

  const form = useForm<ExpertReviewFormData>({
    resolver: zodResolver(expertReviewSchema),
    defaultValues: {
      rating: 0,
      author: "",
      summary: "",
      pros: [""],
      cons: [""],
      verdict: "",
    },
  });

  const handleAddPro = () => setPros([...pros, ""]);
  const handleAddCon = () => setCons([...cons, ""]);

  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros];
    newPros[index] = value;
    setPros(newPros);
    form.setValue("pros", newPros.filter(pro => pro.trim() !== ""));
  };

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons];
    newCons[index] = value;
    setCons(newCons);
    form.setValue("cons", newCons.filter(con => con.trim() !== ""));
  };

  const onSubmit = async (data: ExpertReviewFormData) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("expert_reviews")
        .insert({
          product_id: productId,
          rating: data.rating,
          author: data.author,
          summary: data.summary,
          pros: data.pros,
          cons: data.cons,
          verdict: data.verdict,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expert review added successfully",
      });
      
      form.reset();
      setPros([""]);
      setCons([""]);
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add expert review",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    pros,
    cons,
    handleAddPro,
    handleAddCon,
    handleProChange,
    handleConChange,
    onSubmit,
  };
}