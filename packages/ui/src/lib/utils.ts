import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPageTitle(pathname: string): string {
  const basePath = pathname.slice(1).split("/")[0] || "";

  const title = basePath
    .split("-") // split by dash
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // capitalize
    .join(" "); // join with space

  return title || "";
}
