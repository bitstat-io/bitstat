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

export function getFirstNameFromEmail(email: string): string {
  // Validate email format
  if (!email || !email.includes("@")) {
    return "";
  }

  // Extract the local part (before @)
  const localPart = email.split("@")[0];

  // Guard against undefined localPart
  if (!localPart) {
    return "";
  }

  // Split by common separators: . _ - and any digits
  const nameParts = localPart.split(/[._\-0-9]+/);

  // Get the first non-empty part
  const firstName = nameParts.find((part) => part.length > 0);

  if (!firstName) {
    return "";
  }

  // Capitalize first letter, lowercase the rest
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}
