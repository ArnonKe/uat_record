import { NextAuthOptions } from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

type AuthToken = JWT & {
  role?: string;
  username?: string;
  staffId?: string | null;
  department?: string | null;
  signatureUrl?: string | null;
};

type AuthSession = Session & {
  user: NonNullable<Session["user"]> & {
    id?: string;
    role?: string;
    username?: string;
    staffId?: string | null;
    department?: string | null;
    signatureUrl?: string | null;
  };
};

type AuthUser = {
  id: string | number;
  name?: string | null;
  username?: string;
  role?: string;
  staffId?: string | null;
  department?: string | null;
  signatureUrl?: string | null;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: authSecret,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username.trim();
        const password = credentials.password.trim();

        const user = await prisma.user.findUnique({
          where: { username: username },
        });

        if (!user) return null;

        // Simple check for now, in production use bcrypt
        if (user.password !== password) return null;

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
      const authToken = token as AuthToken;

      if (user) {
        const authUser = user as AuthUser;
        authToken.role = authUser.role;
        authToken.username = authUser.username;
        authToken.staffId = authUser.staffId;
        authToken.department = authUser.department;
        authToken.signatureUrl = authUser.signatureUrl;
      }

      return authToken;
    },
    async session({ session, token }) {
      const authSession = session as AuthSession;
      const authToken = token as AuthToken;

      if (token) {
        authSession.user.id = authToken.sub;
        authSession.user.role = authToken.role;
        authSession.user.username = authToken.username;
        authSession.user.staffId = authToken.staffId;
        authSession.user.department = authToken.department;
        authSession.user.signatureUrl = authToken.signatureUrl;
      }

      return authSession;
    },
  },
};
