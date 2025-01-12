import * as z from "zod";
import type { Json } from "@/integrations/supabase/types";

const baseProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  model_name: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  display_specs: z.string().min(1, "Display specifications are required"),
  processor: z.string().min(1, "Processor is required"),
  ram: z.string().min(1, "RAM is required"),
  storage: z.string().min(1, "Storage is required"),
  battery: z.string().min(1, "Battery specifications are required"),
  os: z.string().optional(),
  color: z.string().optional(),
  image_url: z.string().optional(),
  gallery_images: z.array(z.string()).optional(),
  multimedia_specs: z.custom<Json>().optional(),
  design_specs: z.custom<Json>().optional(),
  performance_specs: z.custom<Json>().optional(),
  display_details: z.custom<Json>().optional(),
});

export const mobileProductSchema = baseProductSchema.extend({
  camera: z.string().min(1, "Camera specifications are required"),
  chipset: z.string().optional(),
  charging_specs: z.string().optional(),
  screen_size: z.string().optional(),
  resolution: z.string().optional(),
  camera_details: z.custom<Json>().optional(),
  sensor_specs: z.custom<Json>().optional(),
  network_specs: z.custom<Json>().optional(),
  general_specs: z.custom<Json>().optional(),
});

export const laptopProductSchema = baseProductSchema.extend({
  graphics: z.string().optional(),
  ports: z.string().optional(),
  connectivity_specs: z.custom<Json>().optional(),
});

export type ProductFormData = z.infer<typeof mobileProductSchema> | z.infer<typeof laptopProductSchema>;

export const expertReviewSchema = z.object({
  rating: z.number().min(0).max(10),
  author: z.string().min(1, "Author is required"),
  summary: z.string().min(1, "Summary is required"),
  pros: z.array(z.string()).min(1, "At least one pro is required"),
  cons: z.array(z.string()).min(1, "At least one con is required"),
  verdict: z.string().min(1, "Verdict is required"),
});

export type ExpertReviewFormData = z.infer<typeof expertReviewSchema>;