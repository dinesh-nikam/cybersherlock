import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ip } = req.body;
    try {
      const response = await axios.get(
        `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
        {
          headers: { "x-apikey": process.env.VIRUSTOTAL_API_KEY },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch VirusTotal data" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
