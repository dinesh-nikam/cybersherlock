import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ip } = req.body;
    try {
      const response = await axios.get(
        `https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_API_KEY}`
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch IPinfo data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
