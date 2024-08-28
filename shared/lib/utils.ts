import { type ClassValue, clsx } from "clsx";
import * as _ from "lodash-es";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAvatarInitials = (name: string | undefined): string | null => {
  if (!name) return null;
  // Split the name into words
  const words = _.words(name);

  // Get the first letter of the first word
  const firstLetter = _.upperFirst(_.head(words)?.charAt(0) || "");

  // Get the first letter of the last word (if available)
  const lastLetter = _.upperFirst(_.last(words)?.charAt(0) || "");

  // Return the initials, combining first and last letters
  return `${firstLetter}${lastLetter}`;
};
