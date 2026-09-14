import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { prisma } from "@/shared/lib/prisma";
import { verifyPassword } from "@/shared/lib/auth";

// Custom error classes — the `code` property IS forwarded to the client via result.code
class InvalidCredentialsError extends CredentialsSignin {
  code = "INVALID_CREDENTIALS";
}
class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}
class MissingCredentialsError extends CredentialsSignin {
  code = "EMAIL_AND_PASSWORD_REQUIRED";
}

if (!process.env.NEXTAUTH_SECRET?.trim()) {
  throw new Error(
    "NEXTAUTH_SECRET is not set or is empty in .env.local. " +
    "Generate one with: openssl rand -base64 32 " +
    "and paste the result as the value (no surrounding quotes needed in a .env file)."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

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
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new MissingCredentialsError();
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
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
          throw new InvalidCredentialsError();
        }

        const isValid = await verifyPassword(password, user.passwordHash);
        if (!isValid) {
          throw new InvalidCredentialsError();
        }

        if (!user.isVerified) {
          throw new EmailNotVerifiedError();
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
      // Only run DB upsert for Google OAuth
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          await prisma.user.upsert({
            where: { email: user.email.toLowerCase().trim() },
            update: {
              name: user.name ?? undefined,
              avatarUrl: user.image ?? undefined,
              isVerified: true,
            },
            create: {
              email: user.email.toLowerCase().trim(),
              name: user.name ?? "Google Corper",
              avatarUrl: user.image ?? undefined,
              role: "PCM",
              applicationRole: "USER",
              nyscStatus: "PCM",
              isVerified: true,
            },
          });
        } catch (err) {
          console.error("[NextAuth] Google signIn DB sync error:", err);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // On initial sign-in, enrich token from user object or DB
      if (user) {
        token.id = user.id as string;

        if (account?.provider === "google" && user.email) {
          // Google OAuth — fetch role fields from DB
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
              id: true,
              role: true,
              applicationRole: true,
              nyscStatus: true,
              isVerified: true,
            },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.applicationRole = dbUser.applicationRole;
            token.nyscStatus = dbUser.nyscStatus;
            token.isVerified = dbUser.isVerified;
          }
        } else {
          // Credentials — fields already on the user object from authorize()
          const u = user as typeof user & {
            role?: string;
            applicationRole?: string;
            nyscStatus?: string;
            isVerified?: boolean;
          };
          token.role = u.role;
          token.applicationRole = u.applicationRole;
          token.nyscStatus = u.nyscStatus;
          token.isVerified = u.isVerified ?? false;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Populate session.user from JWT token (no DB query per request)
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.applicationRole = token.applicationRole as string;
        session.user.nyscStatus = token.nyscStatus as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth",
  },
});
