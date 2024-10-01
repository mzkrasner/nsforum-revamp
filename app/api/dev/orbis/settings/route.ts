import { env } from "@/env";
import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async () => {
  if (!env.ORBIS_DB_AUTH_TOKEN)
    return Response.json({
      error: "ORBIS_DB_AUTH_TOKEN env variable is required",
      status: 500,
    });

  try {
    const { data } = await axios.get(
      `${env.NEXT_PUBLIC_ORBIS_NODE_URL}/api/settings`,
      {
        headers: {
          Authorization: `Bearer ${env.ORBIS_DB_AUTH_TOKEN}`,
        },
      },
    );
    if (data.settings) {
      return NextResponse.json(data.settings);
    } else {
      return Response.json({
        error: "No settings object was returned",
        status: 500,
      });
    }
  } catch (error) {}
};
