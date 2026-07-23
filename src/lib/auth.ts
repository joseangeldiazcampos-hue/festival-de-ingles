/**
 * NextAuth v5 configuration
 *
 * Uses a simple Credentials provider with a single admin password.
 * No database for auth — the password is stored in env vars.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev-secret-change-in-production-32chars",
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
