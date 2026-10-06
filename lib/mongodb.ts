import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) throw new Error("Missing MONGO_URI in .env.local");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global._mongoClientPromise ?? (global._mongoClientPromise = new MongoClient(uri).connect());

export async function getDb() {
  const client = await clientPromise;
  return client.db(); // ใช้ชื่อ DB จาก URI (my_database)
}