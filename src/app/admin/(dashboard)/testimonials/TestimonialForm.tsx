"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Testimonial } from "@/types";
import { createTestimonial, updateTestimonial } from "@/lib/actions/testimonials";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  testimonial?: Testimonial | null;
}

export default function TestimonialForm({ testimonial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = testimonial 
      ? await updateTestimonial(testimonial.id, formData)
      : await createTestimonial(formData);

    if (result.success) {
      router.push("/admin/testimonials");
      router.refresh();
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center gap-4 mb-4">
        <ButtonLink href="/admin/testimonials" variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <h2 className="text-xl font-semibold">
          {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Author Name <span className="text-red-500">*</span></Label>
          <Input id="name" name="name" defaultValue={testimonial?.name || ""} required />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="role">Role/Job/Origin (Optional)</Label>
          <Input id="role" name="role" defaultValue={testimonial?.role || ""} placeholder="Example: Traveler from London" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content">Testimonial Content <span className="text-red-500">*</span></Label>
          <Textarea 
            id="content" 
            name="content" 
            rows={4} 
            defaultValue={testimonial?.content || ""} 
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input 
              id="rating" 
              name="rating" 
              type="number" 
              min={1} 
              max={5} 
              defaultValue={testimonial?.rating || 5} 
              required 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avatar_url">Avatar URL (Current)</Label>
            <Input id="avatar_url" name="avatar_url" defaultValue={testimonial?.avatar_url || ""} readOnly className="bg-muted cursor-not-allowed" />
            <Label htmlFor="avatar_file" className="mt-2 text-primary font-medium cursor-pointer">
              Upload New Avatar
            </Label>
            <Input id="avatar_file" name="avatar_file" type="file" accept="image/*" />
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-muted/30 p-4 rounded-md border border-dashed">
          <input 
            type="checkbox" 
            id="is_active" 
            name="is_active" 
            value="true"
            defaultChecked={testimonial ? testimonial.is_active : true}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="is_active" className="cursor-pointer">Enable Testimonial (Show on Homepage)</Label>
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-4">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Testimonial
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
