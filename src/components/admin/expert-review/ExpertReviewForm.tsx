import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ExpertReviewFields } from "./ExpertReviewFields";
import { ProsConsFields } from "./ProsConsFields";
import { useExpertReview } from "./useExpertReview";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ExpertReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  className?: string;
}

export function ExpertReviewForm({ productId, onSuccess, className }: ExpertReviewFormProps) {
  const {
    form,
    isLoading,
    pros,
    cons,
    handleAddPro,
    handleAddCon,
    handleProChange,
    handleConChange,
    onSubmit,
  } = useExpertReview(productId, onSuccess);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Add Expert Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ExpertReviewFields form={form} />

            <ProsConsFields
              items={pros}
              onItemChange={handleProChange}
              onAddItem={handleAddPro}
              label="Pro"
            />

            <ProsConsFields
              items={cons}
              onItemChange={handleConChange}
              onAddItem={handleAddCon}
              label="Con"
            />

            <FormField
              control={form.control}
              name="verdict"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verdict</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Expert Review"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}