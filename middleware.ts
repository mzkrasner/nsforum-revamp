import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Disable /api/dev routes in non-development environments
  if (pathname.startsWith("/api/dev")) {
    if (process.env.NODE_ENV !== "development") {
      return new NextResponse("Route disabled in production", { status: 404 });
    }
    return NextResponse.next();
  }

  // Guard admin pages
  const privyToken = request.cookies.get("privy-token");
  if (!privyToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Forward to serverless function for detailed verification
  const validationUrl = new URL("/api/validate-token", request.url);
  validationUrl.searchParams.set("token", privyToken.value);
  return NextResponse.rewrite(validationUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
