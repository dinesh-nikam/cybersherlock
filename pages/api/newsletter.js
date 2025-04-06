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
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      const client = await clientPromise;
      const database = client.db(); // Use the default database from the URI
      const collection = database.collection("newsletter");

      const existingEmail = await collection.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already subscribed" });
      }

      await collection.insertOne({ email, subscribedAt: new Date() });
      res
        .status(201)
        .json({ message: "Successfully subscribed to the newsletter" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
