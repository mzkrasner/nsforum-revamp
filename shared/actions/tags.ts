"use server";

import { connectDbWithSeed } from "@/app/api/_orbis";
import { insertRow } from "../orbis/utils";
import { Tag } from "../types/tag";

export const createTag = async (data: Tag) => {
  await connectDbWithSeed();

  return await insertRow({ model: "tags", value: data });
};
