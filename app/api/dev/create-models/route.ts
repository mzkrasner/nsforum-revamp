import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "../../_orbis";
import { createModel } from "../../_orbis/queries";

// TODO: Pass seed from script
export const POST = async (req: NextRequest) => {
  await connectDb();

  const model = await req.json();
  const res = await createModel(model);

  return NextResponse.json(res);
};
