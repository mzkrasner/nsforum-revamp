import { NextRequest, NextResponse } from "next/server";
import { connectDbWithExternalSeed } from "../_orbis";

export const POST = async (req: NextRequest) => {
  const { seedString } = (await req.json()) || {};
  const authInfo = await connectDbWithExternalSeed(seedString);
  return NextResponse.json(authInfo);
};
