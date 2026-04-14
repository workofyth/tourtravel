import { getSiteSettings } from "@/lib/queries/settings";
import SettingsForm from "./SettingsForm";

export const metadata = {
  title: "Site Settings | Admin",
};

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground">Manage site information, logo, contacts, and social media links.</p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
