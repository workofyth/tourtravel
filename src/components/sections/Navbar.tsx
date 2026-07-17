import { getSiteSettings } from "@/lib/queries/settings";
import { getAllCategories } from "@/lib/queries/categories";
import { NavbarClient } from "./NavbarClient";
import { getLocale } from "next-intl/server";

export async function Navbar() {
  const locale = await getLocale();
  const settings = await getSiteSettings(locale);
  const categories = await getAllCategories(locale);

  return <NavbarClient settings={settings} categories={categories} />;
}
