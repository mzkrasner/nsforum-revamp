import { connectDbWithSeed } from "@/app/api/_orbis";
import { NextRequest } from "next/server";
import { createModel } from "../utils";

export const POST = async (req: NextRequest) => {
  const { schema } = (await req.json()) || {};
  await connectDbWithSeed();
  const res = await createModel(schema);

  return Response.json(res);
};
