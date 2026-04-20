import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `₸ ${amount.toLocaleString("ru-RU")}`;
}

export function formatCountdown(seconds: number): {
  hours: string;
  minutes: string;
  secs: string;
} {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return {
    hours: String(h).padStart(2, "0"),
    minutes: String(m).padStart(2, "0"),
    secs: String(s).padStart(2, "0"),
  };
}

export function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
