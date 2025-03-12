// lib/mongodb.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri: string = process.env.MONGODB_URI;
const options = {};

let client = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Use a global variable in development to preserve the value across module reloads
  if (!(global as any)._mongoClientPromise) {
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production, it's best not to use a global variable.
  clientPromise = client.connect();
}

export default clientPromise;
