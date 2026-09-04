import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/shared/lib/prisma";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_client_id.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_client_secret",
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
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
        return true;
      } catch (err) {
        console.error("Google Auth Database Sync Error:", err);
        return true;
      }
    },
    async session({ session }: any) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            role: true,
            applicationRole: true,
            nyscStatus: true,
            isVerified: true,
          },
        });
        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).role = dbUser.role;
          (session.user as any).applicationRole = dbUser.applicationRole;
          (session.user as any).nyscStatus = dbUser.nyscStatus;
          (session.user as any).isVerified = dbUser.isVerified;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET || "kopawee_super_secret_jwt_key_2026_nysc_companion",
};

const handler = NextAuth(authOptions) as any;

export { handler as GET, handler as POST };
