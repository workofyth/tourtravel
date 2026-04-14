"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteTestimonial } from "@/lib/actions/testimonials";
import { Button } from "@/components/ui/button";

export default function DeleteTestimonialButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus testimonial ini?")) {
      setLoading(true);
      const res = await deleteTestimonial(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.message);
        setLoading(false);
      }
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
