"use client";

import { Loader2, Image as ImageIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createTransportation, updateTransportation } from "@/lib/actions/transportation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Transportation } from "@/types";
import { getImageUrl } from "@/lib/utils";

const transportationFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters."),
  capacity_pax: z.number().min(1, "Capacity must be at least 1 pax."),
  capacity_luggage: z.number().min(0, "Luggage capacity cannot be negative."),
  price_per_day: z.number().min(0, "Price cannot be negative."),
  description: z.string().optional(),
  is_active: z.boolean(),
});

type TransportationFormValues = z.infer<typeof transportationFormSchema>;

export default function TransportationForm({ 
  initialData 
}: { 
  initialData?: Transportation;
}) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<TransportationFormValues>({
    resolver: zodResolver(transportationFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      capacity_pax: initialData?.capacity_pax ? Number(initialData.capacity_pax) : 4,
      capacity_luggage: initialData?.capacity_luggage ? Number(initialData.capacity_luggage) : 2,
      price_per_day: initialData?.price_per_day ? Number(initialData.price_per_day) : 0,
      description: initialData?.description || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    getImageUrl(initialData?.image_url, 'transportations')
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: TransportationFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("slug", values.slug);
    formData.append("capacity_pax", values.capacity_pax.toString());
    formData.append("capacity_luggage", values.capacity_luggage.toString());
    formData.append("price_per_day", values.price_per_day.toString());
    formData.append("description", values.description || "");
    formData.append("is_active", values.is_active.toString());
    
    if (selectedFile) {
        formData.append("image", selectedFile);
    }
    
    if (isEditing && initialData?.image_url) {
        formData.append("existing_image", initialData.image_url);
    }

    try {
      const res = isEditing 
        ? await updateTransportation(initialData.id, formData)
        : await createTransportation(formData);
      
      if (res.success) {
        toast.success(res.message);
        router.push("/admin/transportations");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to save transportation.");
    }
  };

  const generateSlug = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    form.setValue("slug", slug);
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Example: Toyota Hiace"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!isEditing) generateSlug(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="toyota-hiace" {...field} />
                    </FormControl>
                    <FormDescription>Used for URL: /transportation/[slug]</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="capacity_pax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (Pax)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity_luggage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (Luggage)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_per_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Day (RM)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Vehicle Photo</FormLabel>
              <div className="flex items-start gap-4">
                {previewImage ? (
                  <div className="relative h-40 w-64 rounded-lg overflow-hidden border bg-muted">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-40 w-64 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center hover:bg-muted transition-colors gap-2"
                  >
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">Upload Vehicle Photo</span>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
              <p className="text-[12px] text-muted-foreground">
                Maximum 10MB. 16:9 aspect ratio suggested for best display.
              </p>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Features</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List features like: AC, Driver included, Fuel included, etc." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active (Show on website)</FormLabel>
                    <p className="text-sm text-muted-foreground">This service will be visible to users on the landing page.</p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-4 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Transportation"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
