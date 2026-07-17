"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/lib/actions/booking";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  email: z.string().email({ message: "Invalid email." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  travel_date: z.string().min(1, { message: "Travel date is required." }),
  pax: z.number().min(1, { message: "Minimum 1 person." }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BookingForm({ packageId, title }: { packageId: string; title: string }) {
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("packageDetail");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      travel_date: "",
      pax: 1,
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("package_id", packageId);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("travel_date", values.travel_date);
    formData.append("pax", values.pax.toString());
    formData.append("notes", values.notes || "");

    try {
      const res = await createBooking(null, formData);
      if (res.success) {
        toast.success(res.message);
        form.reset();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred while booking the package.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="shadow-lg border-primary/20 bg-background/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl">{t("bookPackage")}</CardTitle>
        <CardDescription>
          {t("startingFrom")} <span className="font-bold text-primary">{t("perPax")}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fullName")}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
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
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder="+62..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="travel_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("travelDate")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="date" {...field} className="pl-10" />
                      <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("participants")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("specialNotes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("notesPlaceholder")}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4 pb-2 border-t mt-6">
              <Button type="submit" className="w-full text-lg h-12" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("processing")}
                  </>
                ) : (
                  t("confirmBooking")
                )}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              {t("bookingNote")}
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
