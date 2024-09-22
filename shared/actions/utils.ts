import { revalidateTag } from "next/cache";

export const revalidateTagsFromClient = async (tags: string | string[]) => {
  if (typeof tags === "string") tags = [tags];
  tags.forEach((tag) => revalidateTag(tag));
};
