import { revalidateTag } from "next/cache";

export const revalidateTagFromClient = async (tag: string) => {
  revalidateTag(tag);
};
