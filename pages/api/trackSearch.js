import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/cybersherlock"; // Updated database URI

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, searchType, searchValue } = req.body;

    if (!username || !searchType || !searchValue) {
      return res
        .status(400)
        .json({ error: "Username, search type, and value are required" });
    }

    try {
      const client = await clientPromise;
      const database = client.db(); // Use the default database from the URI
      const collection = database.collection("searches");

      await collection.insertOne({
        username,
        searchType,
        searchValue,
        searchedAt: new Date(),
      });

      res.status(201).json({ message: "Search tracked successfully" });
    } catch (error) {
      console.error("Error tracking search:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
