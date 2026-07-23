/**
 * NextAuth v5 configuration
 *
 * Uses a simple Credentials provider with a single admin password.
 * Enables trustHost: true to work seamlessly on Render.com and reverse proxies.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "super-secret-key-festival-ingles-2026-xyz",
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        if (credentials?.password === adminPassword) {
          return { id: "admin", name: "Administrator", email: "admin@festival" };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
});
