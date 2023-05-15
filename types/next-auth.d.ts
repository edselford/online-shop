import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      name: string,
      id: string,
      role: string
    } & DefaultSession["user"]
  }
}