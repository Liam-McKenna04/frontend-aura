import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hs(s: string, maxValue: number): number {
  if (maxValue < 1) {
      throw new Error("maxValue must be 1 or greater");
  }

  // Simple hash function to generate a deterministic value from the string
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
  }

  // Ensure the result is positive and within the range [0, maxValue]

  

  return (Math.abs(hash) % maxValue);



}
