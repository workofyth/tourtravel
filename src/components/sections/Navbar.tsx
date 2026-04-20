import { getSiteSettings } from "@/lib/queries/settings";
import { getAllCategories } from "@/lib/queries/categories";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const settings = await getSiteSettings();
  const categories = await getAllCategories();

  return <NavbarClient settings={settings} categories={categories} />;
}

