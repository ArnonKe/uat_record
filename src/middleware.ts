import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;
const env = process.env.NODE_ENV;
const ipRuning = process.env.IPRUNMD;

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // const cookie = request.cookies.getAll();
  // console.log('cookie',cookie);
  let token;
  if (env === "production") {
    token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: "next-auth.session-token", // Explicitly look for session cookie
    });
  } else {
    //for test
    token = true;
  }
  // console.log("Token Found:", token);
  if (token) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    return response;
  } else {
    return NextResponse.redirect(
      new URL("http://172.22.16.1:8899/login", request.url),
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
  "/",
  "/PM/:path*",
  "/ldap/:path*",
  "/mail-group/:path*",
  "/dashboard/:path*",
  "/chart/:path*",
  "/table/:path*",
  "/CCTV/:path*",
  "/License/:path*",
  "/Asset_Management/:path*",
  "/Audit_Inspect/:path*",
  "/Log_Inspectation/:path*",
  ],
};
