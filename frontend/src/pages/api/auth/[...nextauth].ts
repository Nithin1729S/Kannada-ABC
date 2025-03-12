// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/@props/mongodb";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT-based sessions so that getToken works in middleware
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl; // Redirect to home ("/") after login
    },
  },
  events: {
    async createUser({ user }) {
      // Build an object with your custom fields
      const additionalFields: Record<string, any> = {};
      // Instead of numeric keys, use a naming convention like field1, field2, ...
      for (let i = 1; i <= 49; i++) {
        additionalFields[`field${i}`] = 0; // default value; adjust as needed
      }
      additionalFields.progress = 0; // default progress

      // Connect to the database and update the user document
      const client = await clientPromise;
      const db = client.db();
      await db.collection("users").updateOne(
        { email: user.email }, // filter using email instead of id
        { $set: additionalFields }
      );
    },
  },
});

