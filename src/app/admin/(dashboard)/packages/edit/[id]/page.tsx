export const dynamic = "force-dynamic";

import { getAllCategories } from "@/lib/queries/categories";
import { pool } from "@/lib/db";
import PackageForm from "../../PackageForm";
import { notFound } from "next/navigation";

export default async function EditPackagePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const categories = await getAllCategories();
  const pkgRes = await pool.query("SELECT * FROM packages WHERE id = $1", [params.id]);
  const pkg = pkgRes.rows[0];

  if (!pkg) {
    notFound();
  }

  const itiRes = await pool.query("SELECT * FROM itineraries WHERE package_id = $1 ORDER BY day_number ASC", [params.id]);
  pkg.itineraries = itiRes.rows;

  const imgRes = await pool.query("SELECT * FROM package_images WHERE package_id = $1 ORDER BY sort_order ASC", [params.id]);
  pkg.images = imgRes.rows;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Tour Package</h1>
        <p className="text-muted-foreground mt-1">Update your package details and pricing.</p>
      </div>
      
      <PackageForm categories={categories} initialData={pkg} />
    </div>
  );
}
