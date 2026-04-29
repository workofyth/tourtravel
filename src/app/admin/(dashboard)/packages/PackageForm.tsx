"use client";

import { Loader2, Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { useState, useRef } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPackage, updatePackage } from "@/lib/actions/package";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@/components/ui/editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { getImageUrl } from "@/lib/utils";

const packageFormSchema = z.object({
  category_id: z.string().min(1, "Please select a category."),
  title: z.string().min(3, "Package title must be at least 3 characters."),
  slug: z.string().min(3, "Package slug must be at least 3 characters."),
  price: z.number().min(0, "Price cannot be negative."),
  price_child: z.number().min(0, "Price cannot be negative.").optional(),
  price_infant: z.number().min(0, "Price cannot be negative.").optional(),
  duration_days: z.number().min(1, "Duration must be at least 1 day."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  is_featured: z.boolean(),
  itineraries: z.array(z.object({
    day_number: z.number(),
    title: z.string().min(1, "Day title is required."),
    description: z.string().optional(),
  })),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

export default function PackageForm({ 
  categories, 
  initialData 
}: { 
  categories: { id: string; name: string }[];
  initialData?: any;
}) {
  const router = useRouter();
  const isEditing = !!initialData;

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      category_id: initialData?.category_id || "",
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      price: initialData?.price ? Number(initialData.price) : 0,
      price_child: initialData?.price_child ? Number(initialData.price_child) : 0,
      price_infant: initialData?.price_infant ? Number(initialData.price_infant) : 0,
      duration_days: initialData?.duration_days ? Number(initialData.duration_days) : 1,
      description: initialData?.description || "",
      is_featured: initialData?.is_featured === true || initialData?.is_featured === "true",
      itineraries: initialData?.itineraries || [{ day_number: 1, title: "", description: "" }],
    },
  });

  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.images?.map((img: any) => img.image_url) || []
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itineraries",
  });

  const onSubmit = async (values: PackageFormValues) => {
    const formData = new FormData();
    formData.append("category_id", values.category_id);
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("price", values.price.toString());
    formData.append("price_child", (values.price_child || 0).toString());
    formData.append("price_infant", (values.price_infant || 0).toString());
    formData.append("duration_days", values.duration_days.toString());
    formData.append("description", values.description);
    formData.append("is_featured", values.is_featured.toString());
    formData.append("itineraries", JSON.stringify(values.itineraries));
    
    // Multiple Images
    selectedFiles.forEach(file => formData.append("images", file));
    formData.append("existing_images", JSON.stringify(existingImages));

    if (existingImages.length === 0 && selectedFiles.length === 0) {
      toast.error("Please upload at least 1 image.");
      return;
    }

    try {
      const res = isEditing 
        ? await updatePackage(initialData.id, formData)
        : await createPackage(formData);
      
      if (res.success) {
        toast.success(res.message);
        router.push("/admin/packages");
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to save package.");
    }
  };

  const generateSlug = (title: string) => {
    const slug = title
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Example: Romance Holiday in Bali"
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
                      <Input placeholder="romance-holiday-bali" {...field} />
                    </FormControl>
                    <FormDescription>Used for URL: /packages/[slug]</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-5 gap-6">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category">
                            {categories.find(d => d.id === field.value)?.name}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((d) => (
                          <SelectItem key={d.id} value={d.id} label={d.name}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>12 years++ (RM)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_child"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4-11 years (RM)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price_infant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3 years-- (RM)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Tour Package Photos</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((url, idx) => (
                  <div key={url} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                    <Image
                      src={getImageUrl(url, 'packages')}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setExistingImages(prev => prev.filter(img => img !== url))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {idx === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-[10px] text-center py-0.5">
                        Cover
                      </div>
                    )}
                  </div>
                ))}

                {/* Newly Selected Previews */}
                {selectedFiles.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                      <Image
                        src={url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {existingImages.length === 0 && idx === 0 && (
                         <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-[10px] text-center py-0.5">
                           Cover
                         </div>
                      )}
                    </div>
                  );
                })}

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center hover:bg-muted transition-colors gap-2"
                >
                  <Plus className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Add Photo</span>
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedFiles(prev => [...prev, ...files]);
                }}
              />
              <p className="text-[12px] text-muted-foreground">
                Maximum 10MB per file. 1080p resolution suggested. The first photo will be the cover.
              </p>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Description</FormLabel>
                  <FormControl>
                    <Editor 
                      value={field.value || ""} 
                      onChange={field.onChange} 
                      placeholder="Write the schedule and activities..." 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show on Home (Featured)</FormLabel>
                    <p className="text-sm text-muted-foreground">This package will appear in the "Popular Packages" section on the landing page.</p>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Itinerary (Daily Schedule)</h3>
                  <p className="text-sm text-muted-foreground">Detailed daily activities for this tour package.</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ day_number: fields.length + 1, title: "", description: "" })}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Day
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg relative bg-muted/30">
                    <div className="flex gap-4 items-start">
                      <div className="pt-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {fields[index].day_number || index + 1}
                        </span>
                      </div>
                      <div className="flex-1 space-y-4">
                        <FormField
                          control={form.control}
                          name={`itineraries.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="sr-only">Day Title</FormLabel>
                              <FormControl>
                                <Input placeholder={`Day Title ${index + 1} (Example: Airport Pickup)`} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                          <FormField
                            control={form.control}
                            name={`itineraries.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="sr-only">Day Description</FormLabel>
                                <FormControl>
                                  <Editor 
                                    value={field.value || ""} 
                                    onChange={field.onChange} 
                                    placeholder="Details of today's activities..."
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                  "Save Package"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
