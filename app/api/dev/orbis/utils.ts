import { orbisdb } from "@/shared/orbis";

export const createModel = async (model: any) => {
  return await orbisdb.ceramic.createModel(model);
};
