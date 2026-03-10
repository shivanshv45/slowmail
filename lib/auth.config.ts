import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config: NO Prisma, NO Node.js APIs
// Used by middleware for JWT session checking only
const authConfig: NextAuthConfig = {
  providers: [], // Providers are added in auth.ts for Node.js runtime
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const { pathname } = request.nextUrl;

      const protectedPaths = ["/compose", "/inbox", "/sent", "/archive", "/profile", "/onboarding", "/discover"];
      const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

      const authPaths = ["/login", "/register"];
      const isAuthPath = authPaths.some((p) => pathname.startsWith(p));

      if (isProtected && !isLoggedIn) {
        return false;
      }

      if (isAuthPath && isLoggedIn) {
        return Response.redirect(new URL("/inbox", request.nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default authConfig;
