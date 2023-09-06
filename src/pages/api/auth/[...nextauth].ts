import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from "@/services/fauna";
import { query as q } from "faunadb";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error("Missing GITHUB_ID or GITHUB_SECRET environment variable");
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;

      try {
        await fauna.query(q.Create(q.Collection("users"), { data: { email } }));
        return true;
      } catch (error) {
        return false;
      }
    },
  },
});
