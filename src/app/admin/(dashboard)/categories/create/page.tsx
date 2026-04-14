export const dynamic = "force-dynamic";

import CategoryForm from "../CategoriesForm";

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Kategori Baru</h1>
        <p className="text-muted-foreground mt-1">Buat kategori wisata baru untuk digunakan di paket tour.</p>
      </div>

      <CategoryForm />
    </div>
  );
}
