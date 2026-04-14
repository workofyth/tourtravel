export const dynamic = "force-dynamic";

import { getAllCategories } from "@/lib/queries/categories";
import PackageForm from "../PackageForm";

export default async function CreatePackagePage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Package</h1>
        <p className="text-muted-foreground mt-1">Create a new holiday travel package and publish it.</p>
      </div>
      
      <PackageForm categories={categories} />
    </div>
  );
}
