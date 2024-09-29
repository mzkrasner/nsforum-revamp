import { NextRequest, NextResponse } from "next/server";
import { connectDbWithExternalSeed, createModel } from "../utils";

export const POST = async (req: NextRequest) => {
  const { model, seedString } = (await req.json()) || {};
  await connectDbWithExternalSeed(seedString);
  const res = await createModel(model);

  return NextResponse.json(res);
};
