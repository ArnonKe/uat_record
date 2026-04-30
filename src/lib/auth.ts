import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const db = prisma as any;
        const user = await db.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        // Simple check for now, in production use bcrypt
        if (user.password !== credentials.password) return null;

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          staffId: user.staffId,
          department: user.department,
          signatureUrl: user.signatureUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.staffId = (user as any).staffId;
        token.department = (user as any).department;
        token.signatureUrl = (user as any).signatureUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        (session.user as any).staffId = token.staffId;
        (session.user as any).department = token.department;
        (session.user as any).signatureUrl = token.signatureUrl;
      }
      return session;
    },
  },
};
