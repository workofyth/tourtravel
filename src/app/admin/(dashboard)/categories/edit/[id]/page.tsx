export const dynamic = "force-dynamic";

import { getCategoryById } from "@/lib/queries/categories";
import { notFound } from "next/navigation";
import CategoryForm from "../../CategoriesForm";

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground mt-1">Update travel category details.</p>
      </div>

      <CategoryForm initialData={category} />
    </div>
  );
}
