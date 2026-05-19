import type { NextAuthConfig } from "next-auth";

const PUBLIC_PATH_PREFIXES = ["/auth", "/api/auth"];
const PUBLIC_PATHS = ["/"];

const authConfig = {
  providers: [],
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      const isPublicPath =
        PUBLIC_PATHS.includes(pathname) ||
        PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

      if (isPublicPath) {
        return true;
      }

      return !!auth;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
