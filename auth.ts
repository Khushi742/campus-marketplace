import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getPrisma } from "@/lib/db";
import { isAllowedGoogleStudent, normalizeStudentEmail } from "@/lib/google-auth";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = normalizeStudentEmail(user.email);
      const isGoogleEmailVerified =
        profile !== undefined &&
        "email_verified" in profile &&
        profile.email_verified === true;
      if (
        account?.provider !== "google" ||
        !isAllowedGoogleStudent(email, isGoogleEmailVerified)
      ) {
        return false;
      }

      const prisma = await getPrisma();
      const now = new Date();
      await prisma.user.upsert({
        where: { email },
        create: {
          email,
          name: user.name?.trim() || email.split("@")[0],
          emailVerified: now,
        },
        update: { emailVerified: now },
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const email = normalizeStudentEmail(user.email);
        const dbUser = await (await getPrisma()).user.findUnique({ where: { email } });
        if (!dbUser) {
          throw new Error("Google account has no matching Campus Marketplace user.");
        }
        token.id = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
