export const dynamic = "force-dynamic";

import { getTransportationById } from "@/lib/queries/transportation";
import TransportationForm from "../../TransportationForm";
import { notFound } from "next/navigation";

export default async function EditTransportationPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const transportation = await getTransportationById(params.id);

  if (!transportation) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Transportation</h1>
        <p className="text-muted-foreground mt-1">Update details for {transportation.name}.</p>
      </div>
      
      <TransportationForm initialData={transportation} />
    </div>
  );
}
