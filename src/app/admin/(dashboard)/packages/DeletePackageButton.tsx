"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePackage } from "@/lib/actions/package";

export default function DeletePackageButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket tour ini? Ini akan permanen.")) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deletePackage(id);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Terjadi kesalahan sistem.");
      }
    });
  };

  return (
    <Button 
      onClick={handleDelete} 
      disabled={isPending} 
      size="sm" 
      variant="ghost" 
      title="Hapus"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
      ) : (
        <Trash2 className="h-4 w-4 text-red-500" />
      )}
    </Button>
  );
}
