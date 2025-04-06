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
    let { ip, username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    if (!ip) {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        ip = data.ip; // Automatically fetch the user's IP
      } catch (error) {
        console.error("Error fetching user IP:", error);
        return res.status(500).json({ error: "Failed to fetch user IP" });
      }
    }

    try {
      const client = await clientPromise;
      const database = client.db(); // Use the default database from the URI
      const collection = database.collection("user_ips");

      await collection.insertOne({
        username,
        ip,
        storedAt: new Date(),
      });

      res.status(201).json({ message: "IP address stored successfully" });
    } catch (error) {
      console.error("Error storing IP address:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
