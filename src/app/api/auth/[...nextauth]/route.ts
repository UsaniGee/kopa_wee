import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/shared/lib/prisma";
import { verifyPassword } from "@/shared/lib/auth";
import type { NextAuthOptions } from "next-auth";
import type { Role, ApplicationRole, NyscStatus } from "@prisma/client";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is not set. Generate one with: openssl rand -base64 32");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("EMAIL_AND_PASSWORD_REQUIRED");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            applicationRole: true,
            nyscStatus: true,
            isVerified: true,
          },
        });

        if (!user || !user.passwordHash) {
          throw new Error("INVALID_CREDENTIALS");
        }

        const isValid = await verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("INVALID_CREDENTIALS");
        }

        if (!user.isVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          applicationRole: user.applicationRole,
          nyscStatus: user.nyscStatus,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Only run DB upsert for Google OAuth — credentials are already validated
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          await prisma.user.upsert({
            where: { email: user.email.toLowerCase().trim() },
            update: {
              name: user.name || "Google Corper",
              avatarUrl: user.image || undefined,
              isVerified: true,
            },
            create: {
              email: user.email.toLowerCase().trim(),
              name: user.name || "Google Corper",
              avatarUrl: user.image || undefined,
              role: "PCM",
              applicationRole: "USER",
              nyscStatus: "PCM",
              isVerified: true,
            },
          });
        } catch (err) {
          console.error("[NextAuth] Google signIn DB sync error:", err);
          // Don't block sign-in on DB error — user can still log in
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // On initial sign-in, attach fields from the user object to the token
      if (user) {
        token.id = user.id;
        // For Google OAuth, fetch role data from DB since it's not in the user object
        if (account?.provider === "google" && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, role: true, applicationRole: true, nyscStatus: true, isVerified: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.applicationRole = dbUser.applicationRole;
            token.nyscStatus = dbUser.nyscStatus;
            token.isVerified = dbUser.isVerified;
          }
        } else {
          // Credentials provider — fields already on the user object
          token.role = (user as any).role;
          token.applicationRole = (user as any).applicationRole;
          token.nyscStatus = (user as any).nyscStatus;
          token.isVerified = (user as any).isVerified;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Read from token (no DB query on every request)
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.applicationRole = token.applicationRole as ApplicationRole;
        session.user.nyscStatus = token.nyscStatus as NyscStatus;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions) as unknown as { GET: unknown; POST: unknown };

export { handler as GET, handler as POST };
