import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | null | undefined, type: 'packages' | 'transportations' | 'testimonials' | 'categories' = 'packages') {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http") || path.startsWith("/uploads/")) return path;
  return `/uploads/${type}/${path}`;
}

export function stripHtml(html: string | null | undefined) {
  if (!html) return "";
  return html
    .replace(/<\/p>|<\/div>|<\/li>|<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
