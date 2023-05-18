import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import md5 from "md5";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },

      async authorize(credentials, _req) {
        const user = await prisma.user.findUnique({
          where: {
            username: credentials?.username,
          },
        });

        if (!user || !credentials) {
          throw new Error("username tidak ditemukan");
        }

        if (user.password !== md5(credentials.password)) {
          throw new Error(
            `password salah, user:${user.password}, credentials:${credentials.password}`
          );
        }

        return { id: user.id, name: user.username, role: user.role };
      },
    }),
  ],
};

export default NextAuth(authOptions);
