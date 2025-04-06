import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { ip } = req.body;

  if (!ip || typeof ip !== "string") {
    return res.status(400).json({ error: "Invalid or missing IP address" });
  }

  if (!process.env.CENSYS_API_KEY) {
    return res.status(500).json({ error: "Server configuration error: Missing API key" });
  }

  try {
    const response = await axios.get(
      `https://search.censys.io/api/v2/hosts/${ip}`,
      {
        headers: { Authorization: `Bearer ${process.env.CENSYS_API_KEY}` },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data || "Failed to fetch Censys data";

    res.status(statusCode).json({ error: message });
  }
}
