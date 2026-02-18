import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!envApiBaseUrl) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

export const apiBaseUrl = envApiBaseUrl;
