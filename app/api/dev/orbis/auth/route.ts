import { connectDbWithSeed } from "@/app/api/_orbis";
import { NextResponse } from "next/server";

export const GET = async () => {
  const authInfo = await connectDbWithSeed();
  return NextResponse.json(authInfo);
};
