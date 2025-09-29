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

export function getBackgroundImage(srcSet = "") {
  const imageSet = srcSet
    .split(", ")
    .map((str) => {
      const [url, dpi] = str.split(" ");
      return `url("${url}") ${dpi}`;
    })
    .join(", ");
  return `image-set(${imageSet})`;
}
