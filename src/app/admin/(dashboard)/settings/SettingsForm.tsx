"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SiteSettings } from "@/types";
import { updateSiteSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const settingsSchema = z.object({
  site_name: z.string().min(1, "Site name is required"),
  logo_url: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  email: z.string().email("Invalid email").nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  facebook_url: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
  twitter_url: z.string().nullable().optional(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export default function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: settings?.site_name || "",
      logo_url: settings?.logo_url || "",
      address: settings?.address || "",
      email: settings?.email || "",
      phone: settings?.phone || "",
      whatsapp: settings?.whatsapp || "",
      facebook_url: settings?.facebook_url || "",
      instagram_url: settings?.instagram_url || "",
      twitter_url: settings?.twitter_url || "",
    },
  });

  // Sync form with settings prop if it changes (e.g. after revalidatePath)
  useEffect(() => {
    if (settings) {
      form.reset({
        site_name: settings.site_name || "",
        logo_url: settings.logo_url || "",
        address: settings.address || "",
        email: settings.email || "",
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        facebook_url: settings.facebook_url || "",
        instagram_url: settings.instagram_url || "",
        twitter_url: settings.twitter_url || "",
      });
    }
  }, [settings, form]);

  const onSubmit = async (values: SettingsValues) => {
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Handle the file separately
      const fileInput = document.getElementById("logo_file") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("logo_file", fileInput.files[0]);
      }

      const result = await updateSiteSettings(formData);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while updating settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="site_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL (current)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} readOnly className="bg-muted cursor-not-allowed" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2">
              <FormLabel htmlFor="logo_file" className="text-primary font-medium cursor-pointer">
                Upload New Logo
              </FormLabel>
              <Input id="logo_file" type="file" accept="image/*" className="mt-2" />
            </div>
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder="Example: +62..." />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">Use international format (example +62...)</p>
              </FormItem>
            )}
          />

          <h3 className="font-semibold mt-6 mb-2">Social Media (Optional)</h3>
          
          <FormField
            control={form.control}
            name="facebook_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook URL</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram URL</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter URL</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

