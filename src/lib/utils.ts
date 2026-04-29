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
