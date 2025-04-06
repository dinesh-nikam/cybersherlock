import { exec } from "child_process";
import fs from "fs";
import xml2js from "xml2js";
import whois from "whois-json";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const config = {
  shodanApiKey: process.env.SHODAN_API_KEY,
  censysApiKey: process.env.CENSYS_API_KEY,
  censysApiSecret: process.env.CENSYS_API_SECRET,
  greynoiseApiKey: process.env.GREYNOISE_API_KEY,
  ipinfoApiKey: process.env.IPINFO_API_KEY,
  virustotalApiKey: process.env.VIRUSTOTAL_API_KEY,
  abuseipdbApiKey: process.env.ABUSEIPDB_API_KEY,
  securitytrailsApiKey: process.env.SECURITYTRAILS_API_KEY,
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ip, target, type } = req.body;

    if (!type) {
      console.error("No type specified in the request body.");
      return res.status(400).json({ error: "Type is required" });
    }

    if (!ip && !target) {
      console.error("No IP address or target provided in the request body.");
      return res
        .status(400)
        .json({ error: "IP address or target is required" });
    }

    try {
      if (type === "shodan") {
        const url = `https://api.shodan.io/shodan/host/${ip}?key=${config.shodanApiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Shodan API error: ${response.status} - ${errorText}`
          );
        }
        const data = await response.json();
        return res.status(200).json(data);
      }

      if (type === "scan") {
        const masscanFile = "masscan_results.txt";
        const nmapFile = "nmap_results.xml";

        exec(
          `sudo masscan ${target} -p80,443,22 --rate=100000 -oG ${masscanFile}`,
          (error) => {
            if (error) {
              console.error("Masscan failed:", error);
              return res.status(500).json({ error: "Masscan failed" });
            }

            fs.readFile(masscanFile, "utf8", (err, data) => {
              if (err) {
                console.error("Failed to read Masscan output:", err);
                return res
                  .status(500)
                  .json({ error: "Failed to read Masscan output" });
              }

              const ips = data.match(/\d+\.\d+\.\d+\.\d+/g) || [];
              if (!ips.length)
                return res.json({ message: "No open ports found" });

              fs.writeFileSync("ips.txt", ips.join("\n"));

              exec(`nmap -sV -iL ips.txt -oX ${nmapFile}`, (error) => {
                if (error) {
                  console.error("Nmap failed:", error);
                  return res.status(500).json({ error: "Nmap failed" });
                }

                fs.readFile(nmapFile, (err, data) => {
                  if (err) {
                    console.error("Failed to read Nmap results:", err);
                    return res
                      .status(500)
                      .json({ error: "Failed to read Nmap results" });
                  }

                  xml2js.parseString(data, (err, result) => {
                    if (err) {
                      console.error("Failed to parse Nmap results:", err);
                      return res
                        .status(500)
                        .json({ error: "Failed to parse Nmap results" });
                    }

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

                    return res.status(200).json({ results: scanResults });
                  });
                });
              });
            });
          }
        );
        return;
      }

      if (type === "whois") {
        const whoisData = await whois(ip);
        return res.status(200).json({ whoisData });
      }

      return res.status(400).json({ error: "Invalid type specified" });
    } catch (error) {
      console.error("Error processing request:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    console.error("Invalid HTTP method:", req.method);
    res.status(405).json({ error: "Method not allowed" });
  }
}
