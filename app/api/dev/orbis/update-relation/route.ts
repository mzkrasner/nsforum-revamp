import { connectDbWithSeed } from "@/app/api/_orbis";
import { env } from "@/env";
import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const authInfo = await connectDbWithSeed();
  if (!authInfo)
    return Response.json({ error: "Internal server error", status: 500 });

  const sessionJwt = authInfo.auth.serializedSession;
  const { relation } = (await req.json()) || {};
  try {
    const { data } = await axios.post(
      `${env.NEXT_PUBLIC_ORBIS_NODE_URL}/api/db/foreign-key`,
      relation,
      {
        headers: {
          Authorization: `Bearer ${sessionJwt}`,
        },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
    return Response.json({
      error: (error as AxiosError)?.response?.data || (error as Error)?.message,
      status: 500,
    });
  }
};
