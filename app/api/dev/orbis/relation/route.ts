import { connectDbWithSeed } from "@/app/api/_orbis";
import { env } from "@/env";
import axios, { AxiosError } from "axios";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const authInfo = await connectDbWithSeed();
  console.log("Auth info: ", authInfo);
  if (!authInfo)
    return Response.json({ error: "Internal server error", status: 500 });

  console.log("creating post");
  const { relation } = (await req.json()) || {};
  try {
    const { data } = await axios.post(
      `${env.NEXT_PUBLIC_ORBIS_NODE_URL}/api/db/foreign-key`,
      relation,
      {
        headers: {
          Authorization: `Bearer ${env.ORBIS_DB_AUTH_TOKEN}`,
        },
      },
    );
    console.log("post: ", data);
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({
      error: (error as AxiosError)?.response?.data || (error as Error)?.message,
      status: 500,
    });
  }
};

export const PUT = async (req: NextRequest) => {
  const authInfo = await connectDbWithSeed();
  if (!authInfo)
    return Response.json({ error: "Internal server error", status: 500 });

  console.log("updating relation");
  const { relation } = (await req.json()) || {};
  try {
    const { data } = await axios.put(
      `${env.NEXT_PUBLIC_ORBIS_NODE_URL}/api/db/foreign-key`,
      relation,
      {
        headers: {
          Authorization: `Bearer ${env.ORBIS_DB_AUTH_TOKEN}`,
        },
      },
    );
    console.log("put: ", data);
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({
      error: (error as AxiosError)?.response?.data || (error as Error)?.message,
      status: 500,
    });
  }
};
