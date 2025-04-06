import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP address is required" });
  }

  try {
    // Fetch data from multiple APIs
    const [ipinfoResponse, greynoiseResponse, censysResponse, shodanResponse] =
      await Promise.all([
        fetch(`https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`).then(
          (res) => res.json()
        ),
        fetch(`https://api.greynoise.io/v3/community/${ip}`, {
          headers: { key: process.env.GREYNOISE_API_KEY },
        }).then((res) => res.json()),
        fetch(`https://search.censys.io/api/v2/hosts/${ip}`, {
          headers: {
            Authorization: `Bearer ${process.env.CENSYS_API_KEY}`,
          },
        }).then((res) => res.json()),
        fetch(
          `https://api.shodan.io/shodan/host/${ip}?key=${process.env.SHODAN_API_KEY}`
        ).then((res) => res.json()),
      ]);

    // Map responses to a unified structure
    const aggregatedData = {
      ip: ip || "Unknown IP",
      ipinfo: {
        country: ipinfoResponse.country || "Unknown Country",
        city: ipinfoResponse.city || "Unknown City",
        region: ipinfoResponse.region || "Unknown Region",
        org: ipinfoResponse.org || "Unknown Organization",
        loc: ipinfoResponse.loc || "Unknown Location",
      },
      greynoise: {
        noise: greynoiseResponse.noise || false,
        classification: greynoiseResponse.classification || "Unknown",
        name: greynoiseResponse.name || "No Name",
      },
      censys: {
        hostInfo: censysResponse.result || "No Host Info",
        certificates: censysResponse.certificates || "No Certificates",
      },
      shodan: {
        ports: shodanResponse.ports || [],
        vulns: shodanResponse.vulns || [],
        isp: shodanResponse.isp || "Unknown ISP",
        org: shodanResponse.org || "Unknown Organization",
        asn: shodanResponse.asn || "Unknown ASN",
      },
    };

    // Return the aggregated data
    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch data from one or more sources." });
  }
}
