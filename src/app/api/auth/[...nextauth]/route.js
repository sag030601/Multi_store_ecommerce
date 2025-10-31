import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/prisma"; // Your Prisma client

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("No user found with that email");

        // Check password etc.
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only run this for Google OAuth
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        const [firstName, ...lastNameParts] = user.name?.split(" ") || [];
        const lastName = lastNameParts.join(" "); // in case there's more than just a first name

        if (!existingUser) {
          // Create user if doesn't exist
          await prisma.user.create({
            data: {
              // name: user.name || "",
              email: user.email,
              // image: user.image || null,
              firstName: firstName || "", // Use the extracted first name
              lastName: lastName || "", // Use the remaining part as last name
            },
          });
        }
      }

      return true; // allow login
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },

    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
