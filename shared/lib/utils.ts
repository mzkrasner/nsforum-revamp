import { type ClassValue, clsx } from "clsx";
import { htmlToText } from "html-to-text";
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

export const generateRandomAlphaNumString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return _.sampleSize(characters, length).join("");
};

export const getHtmlContentPreview = (content: string) => {
  const maxLength = 200;
  const text = htmlToText(content);
  if (text.length <= maxLength) {
    return text + "...";
  }
  return text.slice(0, maxLength) + "...";
};
