export const dynamic = "force-dynamic";

import TransportationForm from "../TransportationForm";

export default function CreateTransportationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Transportation</h1>
        <p className="text-muted-foreground mt-1">Add a new vehicle to your transportation service fleet.</p>
      </div>
      
      <TransportationForm />
    </div>
  );
}
