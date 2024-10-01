import { env } from "@/env";
import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async () => {
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
    }
  } catch (error) {}
};
