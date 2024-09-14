import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { htmlToText } from "html-to-text";
import * as _ from "lodash-es";
import { twMerge } from "tailwind-merge";
import { pinata } from "../pinata/config";

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
  const preview = text.slice(0, maxLength);
  return preview + (preview.length < text.length ? "..." : "");
};

export const shortenAddress = (
  address: string,
  startLength: number = 5,
  endLength: number = 5,
) => {
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

export const checkSBT = async (
  address: string,
  actionId: string = "123456789",
) => {
  if (!address) return false;
  const { data } = await axios.get(
    `https://api.holonym.io/sybil-resistance/gov-id/optimism?user=${address}&action-id=${actionId}`,
  );
  return !!data?.isUnique;
};

export const uploadToPinata = async (file: File) => {
  const { data: keyData } = await axios.get("/api/pinata/key");
  const upload = await pinata.upload.file(file).key(keyData.JWT);
  const cid = upload.IpfsHash;
  return cid;
};

export const reverseString = (str: string) => {
  return str.split("").reverse().join("");
};

export const stringToSlug = (str: string) => {
  return str
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing spaces
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove multiple consecutive hyphens
};

export const slugToString = (slug: string) => {
  return slug
    .toLowerCase() // Ensure the string is lowercase
    .replace(/-/g, " ") // Replace hyphens with spaces
    .trim(); // Remove leading and trailing spaces (just in case)
};

export const escapeSQLLikePattern = (pattern: string) => {
  // Escape special characters _ and % by prefixing them with \
  return pattern.replace(/([_%])/g, "\\$1");
};

export const normalizeAndValidateUrl = (url: string): string | null => {
  // Add 'https://' if the URL doesn't start with 'http://' or 'https://'
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url; // Default to 'https://'
  }

  // Try to create a new URL object
  try {
    new URL(url); // Will throw if the URL is invalid
    return url; // Return the normalized URL if valid
  } catch (error) {
    return null; // Return null if the URL is invalid
  }
};
