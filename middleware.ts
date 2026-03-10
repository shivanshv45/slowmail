import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Export the auth middleware as the default middleware function
export default auth;

export const config = {
  matcher: [
    "/compose/:path*",
    "/inbox/:path*",
    "/sent/:path*",
    "/archive/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/discover/:path*",
    "/login",
    "/register",
  ],
};
