const express = require("express");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const xml2js = require("xml2js");
const { Client } = require("@elastic/elasticsearch");
const { S3 } = require("@aws-sdk/client-s3");
const whois = require("whois-json");
const rateLimit = require("express-rate-limit");
const { logErrorToDashboard } = require("./utils/logger");

const app = express();
const port = 3000;

// Ensure `fetch` works properly
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// API Keys Configuration
const config = {
  shodanApiKey: "bqIYcPST9IXdgO3tGyrJoxnjQQIPvf51",
  censysApiKey: "01669aa1-1b71-49d8-8599-366c100f4037",
  CENSYS_API_SECRET: "V4LPR8DzEP0AdP7OC404BJmZz0YA82G",
  greynoiseApiKey:
    "BsZsFFUsb4KobjlKf9RnyW11GHhV9Ozbyr7E0SRX2ScJd0862wnlU3fa1mg4S8we",
  ipinfoApiKey: "47fdb05feb93f6",
  virustotalApiKey:
    "9fff98a95e9b71041ca97ca16d91585f24045577f70f300f513738cd15bc1c1c",
  abuseipdbApiKey:
    "27999265f1c06de4fe573fedf86eeac40139a7eb7cc6c5cb37aeedd1c632e6246fb23a486f261aba",
  securitytrailsApiKey: "UdbuQzjz44qbSOlGLZ46PnsqCrhzu9E4",
};

app.use(express.json());
app.use(express.static(__dirname));

// Serve the Next.js frontend build
app.use(express.static(path.join(__dirname, ".next")));

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: "Too many requests. Please try again later.",
});

app.use(limiter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve favicon.ico
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "favicon.ico"));
});

// Helper function to fetch data
async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Failed to fetch data" };
  }
}

// Existing API routes for Shodan, Censys, GreyNoise, IPInfo, and VirusTotal
app.post("/api/shodan", async (req, res) => {
  const { ip } = req.body;
  console.log("Received request for Shodan data:", ip); // Debugging log
  const url = `https://api.shodan.io/shodan/host/${ip}?key=${config.shodanApiKey}`;
  try {
    const data = await fetchData(url);
    res.json(data);
  } catch (error) {
    console.error("Error fetching Shodan data:", error);
    res.status(500).json({ error: "Failed to fetch Shodan data" });
  }
});

app.post("/api/censys", async (req, res) => {
  const { ip } = req.body;

  try {
    const response = await fetch(
      `https://search.censys.io/api/v2/hosts/${ip}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${config.censysApiKey}:${config.CENSYS_API_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Fetch detailed error
      throw new Error(`Censys API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Censys API error:", error);
    res.status(500).json({ error: "Failed to fetch Censys data" });
  }
});

app.post("/api/greynoise", async (req, res) => {
  const { ip } = req.body;

  try {
    const response = await fetch(
      `https://api.greynoise.io/v3/community/${ip}`,
      {
        headers: {
          "Content-Type": "application/json",
          key: config.greynoiseApiKey, // Corrected header key
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text(); // Fetch detailed error
      throw new Error(`GreyNoise API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("GreyNoise API error:", error);
    res.status(500).json({ error: "Failed to fetch GreyNoise data" });
  }
});

app.post("/api/ipinfo", async (req, res) => {
  const { ip } = req.body;
  const url = `https://ipinfo.io/${ip}?token=${config.ipinfoApiKey}`;
  res.json(await fetchData(url));
});

app.post("/api/virustotal", async (req, res) => {
  const { ip } = req.body;
  const url = `https://www.virustotal.com/api/v3/ip_addresses/${ip}`;
  const options = {
    headers: { "x-apikey": config.virustotalApiKey },
  };
  res.json(await fetchData(url, options));
});

app.post("/api/scan", async (req, res) => {
  const { target } = req.body;
  const masscanFile = "masscan_results.txt";
  const nmapFile = "nmap_results.xml";

  try {
    exec(
      `sudo masscan ${target} -p80,443,22 --rate=100000 -oG ${masscanFile}`,
      (error) => {
        if (error) return res.status(500).json({ error: "Masscan failed" });

        // Read and extract IPs
        fs.readFile(masscanFile, "utf8", (err, data) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Failed to read Masscan output" });

          const ips = data.match(/\d+\.\d+\.\d+\.\d+/g) || [];
          if (!ips.length) return res.json({ message: "No open ports found" });

          fs.writeFileSync("ips.txt", ips.join("\n")); // Store IPs for Nmap

          exec(`nmap -sV -iL ips.txt -oX ${nmapFile}`, (error) => {
            if (error) return res.status(500).json({ error: "Nmap failed" });

            fs.readFile(nmapFile, (err, data) => {
              if (err)
                return res
                  .status(500)
                  .json({ error: "Failed to read Nmap results" });

              xml2js.parseString(data, (err, result) => {
                if (err)
                  return res
                    .status(500)
                    .json({ error: "Failed to parse Nmap results" });

                const scanResults = [];
                (result.nmaprun.host || []).forEach((host) => {
                  const ip = host.address?.[0]?.$.addr || "unknown";
                  (host.ports?.[0]?.port || []).forEach((port) => {
                    scanResults.push({
                      ip,
                      port: port.$.portid,
                      service: port.service?.[0]?.$.name || "unknown",
                    });
                  });
                });

                res.json({ results: scanResults });
              });
            });
          });
        });
      }
    );
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({ error: "Scan failed" });
  }
});

// Fetch Censys IP information
app.post("/api/censys-ip-info", async (req, res) => {
  const { ip } = req.body;

  try {
    const response = await fetch(
      `https://search.censys.io/api/v2/hosts/${ip}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${config.censysApiKey}:${config.CENSYS_API_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Censys API error: ${response.statusText}`);
    }

    const info = await response.json();
    res.json({ info });
  } catch (error) {
    console.error("Censys API error:", error);
    res.status(500).json({ error: "Failed to fetch Censys IP information" });
  }
});

// Fetch GreyNoise IP information
app.post("/api/greynoise-ip-info", async (req, res) => {
  const { ip } = req.body;

  try {
    const response = await fetch(
      `https://api.greynoise.io/v3/community/${ip}`,
      {
        headers: {
          "Content-Type": "application/json",
          key: config.greynoiseApiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GreyNoise API error: ${response.statusText}`);
    }

    const info = await response.json();
    res.json({ info });
  } catch (error) {
    console.error("GreyNoise API error:", error);
    res.status(500).json({ error: "Failed to fetch GreyNoise IP information" });
  }
});

app.post("/api/anomaly-detection", (req, res) => {
  const { networkData } = req.body;

  if (!Array.isArray(networkData) || networkData.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid input. Expected a non-empty array." });
  }

  try {
    // Simple anomaly detection logic (replace with a more advanced algorithm if needed)
    const mean =
      networkData.reduce((sum, value) => sum + value, 0) / networkData.length;
    const threshold = 3 * mean; // Example threshold
    const anomalies = networkData.filter((value) => value > threshold);

    res.json({ anomalies, anomalyDetected: anomalies.length > 0 });
  } catch (error) {
    console.error("Anomaly detection error:", error);
    res.status(500).json({ error: "Failed to perform anomaly detection" });
  }
});

app.post("/api/abuseipdb", async (req, res) => {
  const { ip } = req.body;

  try {
    const response = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`,
      {
        headers: {
          Key: config.abuseipdbApiKey,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`AbuseIPDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("AbuseIPDB API error:", error);
    logErrorToDashboard("AbuseIPDB API error", error.message);
    res.status(500).json({ error: "Failed to fetch AbuseIPDB data" });
  }
});

app.post("/api/whois", async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP address is required" });
  }

  try {
    const whoisData = await whois(ip);
    res.json({ whoisData });
  } catch (error) {
    console.error("WHOIS API error:", error);
    res.status(500).json({ error: "Failed to fetch WHOIS data" });
  }
});

app.post("/api/dark-web", async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP address is required" });
  }

  try {
    // Simulate fetching dark web data (replace with actual implementation)
    const darkWebData = {
      torNode: false,
      details: `No dark web activity found for IP: ${ip}`,
    };
    res.json(darkWebData);
  } catch (error) {
    console.error("Dark Web API error:", error);
    res.status(500).json({ error: "Failed to fetch Dark Web data" });
  }
});

// Fallback to serve the Next.js application for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, ".next", "index.html"));
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  logErrorToDashboard("Uncaught Exception", error.message);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  logErrorToDashboard(
    "Unhandled Rejection",
    reason?.message || "Unknown error"
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
