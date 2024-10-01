import { PrivyClient } from "@privy-io/server-auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "./env";

const privy = new PrivyClient(
  env.NEXT_PUBLIC_PRIVY_APP_ID!,
  env.PRIVY_APP_SECRET!,
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Disable /api/dev routes in non-development environments
  console.log("in middleware: ", env.NODE_ENV);
  console.log("pathname: ", pathname);
  if (pathname.startsWith("/api/dev")) {
    if (env.NODE_ENV !== "development") {
      return new NextResponse("Route disabled in production", { status: 404 });
    }

    return NextResponse.next();
  }

  // Guard admin pages
  const privyToken = request.cookies.get("privy-token");
  if (!privyToken) return NextResponse.redirect(new URL("/", request.url));

  const authTokenClaims = await privy.verifyAuthToken(privyToken.value);
  if (!authTokenClaims) return NextResponse.redirect(new URL("/", request.url));

  const userId = authTokenClaims.userId.replace("did:privy:", "");
  const adminIds: string[] = JSON.parse(env.ADMIN_PRIVY_IDS! || "[]") || [];
  const isAdmin = adminIds.includes(userId);
  if (!isAdmin) return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
