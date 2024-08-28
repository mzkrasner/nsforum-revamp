import { orbisdb } from "@/shared/orbis";

// TODO: Fix type
export const createModel = async (model: any) => {
  return await orbisdb.ceramic.createModel(model);
};
