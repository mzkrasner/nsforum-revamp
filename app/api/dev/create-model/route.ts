import { NextRequest, NextResponse } from "next/server";
import { connectDbWithExternalSeed } from "../_orbis";
import { createModel } from "../_orbis/queries";

export const POST = async (req: NextRequest) => {
  const { model, seedString } = (await req.json()) || {};
  await connectDbWithExternalSeed(seedString);
  const res = await createModel(model);

  return NextResponse.json(res);
};
