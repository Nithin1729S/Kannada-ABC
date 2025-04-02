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
      const additionalFields: Record<string, any> = {};
      for (let i = 1; i <= 49; i++) {
        additionalFields[`letter_score_${i}`] = {
          correct: 0,
          attempted: 0,
        };
      }
      additionalFields[`bubblePopBestScore`] = 0; 
      additionalFields[`snakeGameBestScore`] = 0; 
      additionalFields[`bucketCatchBestScore`] = 0; 


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

