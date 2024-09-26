import { PrivyClient } from "@privy-io/server-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!,
);

export async function middleware(request: NextRequest) {
  const privyToken = request.cookies.get("privy-token");
  if (!privyToken) return NextResponse.redirect(new URL("/", request.url));

  const authTokenClaims = await privy.verifyAuthToken(privyToken.value);
  if (!authTokenClaims) return NextResponse.redirect(new URL("/", request.url));

  const userId = authTokenClaims.userId.replace("did:privy:", "");
  const adminIds: string[] = JSON.parse(process.env.ADMIN_DIDS! || "[]") || [];
  const isAdmin = adminIds.includes(userId);
  if (!isAdmin) return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};