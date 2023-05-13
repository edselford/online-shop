import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.SECRET,
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

        if (user.password !== credentials.password) {
          throw new Error(
            `password salah, user:${user.password}, credentials:${credentials.password}`
          );
        }

        return { id: user.id, name: user.username };
      },
    }),
  ],
};

export default NextAuth(authOptions);