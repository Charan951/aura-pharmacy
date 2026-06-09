import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const apiBaseUrl = envApiBaseUrl || "http://localhost:5000";
