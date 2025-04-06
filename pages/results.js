import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Import the updated Map component
import Map from "../components/Map";

// Typography & Spacing Enhancements
// Use a modern font and adjust line height and letter spacing

// Apply global font style
const globalStyles = {
  fontFamily: "Inter, sans-serif",
  lineHeight: "1.6",
  letterSpacing: "0.02em",
};

// Color & Contrast Enhancements
const backgroundColor = "#1a1a2e"; // Deep navy
const cardBackground = "#2e2e3e"; // Slightly lighter dark gray
const textColor = "#e0e0e0"; // Lightened white text
const gradientBackground = "linear-gradient(145deg, #1f1f2f, #29293f)";

// Card & Section Design
const cardStyles = {
  borderRadius: "16px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  padding: "20px",
  margin: "16px 0",
  background: gradientBackground,
};

// Button & Interaction UI
const buttonStyles = {
  padding: "12px 24px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.2s, box-shadow 0.2s",
};

const hoverButtonStyles = {
  transform: "scale(1.05)",
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
};

// Data Visualization Enhancements
const circularProgressStyles = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "conic-gradient(#4caf50 0%, #4caf50 75%, #ccc 75%, #ccc 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  fontWeight: "bold",
  color: "#fff",
};

// Map Section Enhancements
const mapStyles = {
  border: "1px solid #444",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: "12px",
};

// Icons & Illustrations
const iconStyles = {
  width: "24px",
  height: "24px",
  color: "#4caf50",
};

// Dark Mode Enhancements
const darkModeButtonHover = {
  background: "rgba(255, 255, 255, 0.1)",
  boxShadow: "0 0 8px rgba(255, 255, 255, 0.2)",
};

const SecurityThreatComponent = ({ greynoiseData, virusTotalData }) => {
  const maliciousCount =
    virusTotalData?.data?.attributes?.last_analysis_stats?.malicious || 0;
  const harmlessCount =
    virusTotalData?.data?.attributes?.last_analysis_stats?.harmless || 0;

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-xl font-bold text-white mb-4">
        Security & Threat Intelligence
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GreyNoise Status */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-green-400 mb-3">
            GreyNoise Status
          </h4>
          <p
            className={`text-lg font-bold ${
              greynoiseData?.classification === "benign"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {greynoiseData?.classification === "benign"
              ? "✔ Benign (Safe)"
              : "⚠ Potential Threat"}
          </p>
        </div>

        {/* VirusTotal Analysis */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-red-400 mb-3">
            VirusTotal Analysis
          </h4>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-sm text-gray-300">Malicious</p>
              <div className="w-full bg-red-500 h-2 rounded-full">
                <div
                  className="bg-red-700 h-2 rounded-full"
                  style={{
                    width: `${
                      (maliciousCount / (maliciousCount + harmlessCount)) *
                        100 || 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-300 mt-1">{maliciousCount}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300">Harmless</p>
              <div className="w-full bg-green-500 h-2 rounded-full">
                <div
                  className="bg-green-700 h-2 rounded-full"
                  style={{
                    width: `${
                      (harmlessCount / (maliciousCount + harmlessCount)) *
                        100 || 0
                    }%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-300 mt-1">{harmlessCount}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RiskAnalysisComponent = ({ shodanData }) => {
  const riskLevel = shodanData?.ports?.length > 2 ? "High Risk" : "Low Risk";
  const riskColor =
    riskLevel === "High Risk" ? "text-red-400" : "text-green-400";

  return (
    <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Risk Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Level */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">
            Risk Level
          </h4>
          <p className={`text-lg font-bold ${riskColor}`}>{riskLevel}</p>
        </div>

        {/* Threat Factors */}
        <div className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-blue-400 mb-3">
            Threat Factors
          </h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4l5-5-1.414-1.414L9 11.172l-1.586-1.586L6 11l3 3z" />
              </svg>
              No significant threats detected
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4l5-5-1.414-1.414L9 11.172l-1.586-1.586L6 11l3 3z" />
              </svg>
              Standard ports only
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default function Results() {
  const router = useRouter();
  const { ip } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [whoisData, setWhoisData] = useState(null); // State for WHOIS data
  const [whoisLoading, setWhoisLoading] = useState(false); // State for WHOIS loading
  const [ipinfoData, setIpinfoData] = useState(null);
  const [greynoiseData, setGreynoiseData] = useState(null);
  const [securityTrailsData, setSecurityTrailsData] = useState(null);
  const [virusTotalData, setVirusTotalData] = useState(null);
  const [censysData, setCensysData] = useState(null);
  const [shodanData, setShodanData] = useState(null); // State for Shodan data

  useEffect(() => {
    if (ip) {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip, type: "shodan" }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
          }

          const result = await response.json();
          setData(result);

          const [
            ipinfo,
            greynoise,
            securitytrails,
            virustotal,
            censys,
            shodan,
          ] = await Promise.all([
            fetch("/api/ipinfo", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip }),
            }).then((res) => res.json()),
            fetch("/api/greynoise", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip }),
            }).then((res) => res.json()),
            fetch("/api/securitytrails", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ domain: ip }),
            }).then((res) => res.json()),
            fetch("/api/virustotal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip }),
            }).then((res) => res.json()),
            fetch("/api/censys", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip }),
            }).then((res) => res.json()),
            fetch("/api/shodan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip }),
            }).then((res) => res.json()),
          ]);

          setIpinfoData(ipinfo);
          setGreynoiseData(greynoise);
          setSecurityTrailsData(securitytrails);
          setVirusTotalData(virustotal);
          setCensysData(censys);
          setShodanData(shodan);
        } catch (error) {
          setError("Failed to fetch data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [ip]);

  const fetchWhoisData = async (target) => {
    setWhoisLoading(true);
    try {
      const response = await fetch("/api/whois", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      setWhoisData(result);
    } catch (error) {
      console.error("Error fetching WHOIS data:", error.message);
    } finally {
      setWhoisLoading(false);
    }
  };
  const calculateSecurityScore = () => {
    if (!shodanData) return "N/A";
    const vulnerabilities = shodanData.vulns?.length || 0;
    const ports = shodanData.ports?.length || 0;
    return Math.max(0, 100 - vulnerabilities * 10 - ports * 2); // Example formula
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!data || Object.keys(data).length === 0)
    return <div className="text-center text-red-500">No data found.</div>;

  return (
    <div
      className="min-h-screen bg-gray-900 text-white font-sans"
      style={globalStyles}
    >
      {/* Header */}
      <header className="navbar">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-accent">CyberSherlock</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:text-blue-400 transition">
                  Home
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* IP/Domain Details */}
        <section
          className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-lg mb-8 border border-gray-700"
          style={cardStyles}
        >
          <h2 className="text-4xl font-extrabold text-center text-blue-400 mb-6 tracking-wide">
            🌐 IP/Domain Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div
              className="bg-gradient-to-b from-blue-800 to-blue-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              style={cardStyles}
            >
              <h3 className="text-xl font-bold text-blue-300 mb-4">
                General Info
              </h3>
              <InfoItem label="Name" value={shodanData.domains} />
              <InfoItem label="City" value={data.city} />
              <InfoItem label="Region" value={ipinfoData.region} />
              <InfoItem label="Postal" value={ipinfoData.postal} />
              <InfoItem label="Organization" value={ipinfoData.org} />
              <InfoItem label="TimeZone" value={ipinfoData.timezone} />
            </div>

            {/* Right Column */}
            <div
              className="bg-gradient-to-b from-purple-800 to-purple-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              style={cardStyles}
            >
              <h3 className="text-xl font-bold text-purple-300 mb-4">
                Technical Info
              </h3>
              <InfoItem label="ASN" value={data.asn} />
              <InfoItem label="Hostname" value={data.hostnames?.[0]} />
              <InfoItem label="Location" value={ipinfoData.loc} />
              <InfoItem label="os" value={shodanData.os} />

              <InfoItem label="Country" value={ipinfoData.country} />

              <InfoItem label="Last Update" value={data.last_update} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              style={buttonStyles}
            >
              🚨 Report
            </button>
            <Link
              href={{
                pathname: "/report",
                query: {
                  ipinfoData: JSON.stringify(ipinfoData),
                  greynoiseData: JSON.stringify(greynoiseData),
                  securityTrailsData: JSON.stringify(securityTrailsData),
                  virusTotalData: JSON.stringify(virusTotalData),
                  censysData: JSON.stringify(censysData),
                  shodanData: JSON.stringify(shodanData),
                  whoisData: JSON.stringify(whoisData),
                },
              }}
              legacyBehavior
            >
              <a
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                style={buttonStyles}
              >
                📥 Download Report
              </a>
            </Link>
          </div>
        </section>

        {/* Map Section */}
        <section className="mb-8">
          <div className="bg-gray-800 p-4 rounded shadow" style={mapStyles}>
            <h3 className="text-lg font-semibold mb-2 text-accent">
              Geolocation
            </h3>
            {shodanData?.latitude && shodanData?.longitude ? (
              <Map
                coordinates={[shodanData.longitude, shodanData.latitude]} // Mapbox uses [lng, lat]
                zoom={13}
              />
            ) : (
              <p className="text-gray-400">Location data not available.</p>
            )}
          </div>
        </section>

        {/* Security Score */}
        <section className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-stretch space-y-4 md:space-y-0">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md flex flex-col items-center w-full md:w-2/5 mr-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Security Score
              </h4>
              <div
                className="bg-teal-500 w-24 h-24 rounded-full flex items-center justify-center mb-4"
                style={circularProgressStyles}
              >
                <span className="text-3xl font-bold text-white">
                  {calculateSecurityScore()}
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                  <span
                    className={`mr-2 ${
                      shodanData?.vulns?.length === 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ●
                  </span>
                  {shodanData?.vulns?.length === 0
                    ? "No Vulnerabilities"
                    : `${shodanData?.vulns?.length} Vulnerabilities Found`}
                </li>
                <li className="flex items-center">
                  <span
                    className={`mr-2 ${
                      shodanData?.ssl ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    ●
                  </span>
                  {shodanData?.ssl ? "SSL Secure" : "SSL Not Detected"}
                </li>
                <li className="flex items-center">
                  <span
                    className={`mr-2 ${
                      shodanData?.ports?.includes(443)
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    ●
                  </span>
                  {shodanData?.ports?.includes(443)
                    ? "HTTPS Enabled"
                    : "HTTPS Not Detected"}
                </li>
              </ul>
            </div>

            {/* Open Ports & Services */}
            <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full md:w-3/5">
              <h4 className="text-lg font-semibold text-white mb-4">
                Open Ports & Services
              </h4>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {shodanData?.ports?.map((port, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div>
                      <p className="text-sm text-white font-bold">
                        Port: {port}
                      </p>
                      <p className="text-sm text-gray-300">
                        {shodanData?.data?.find((item) => item.port === port)
                          ?.product || "Unknown Service"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-400">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technical Information Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold mb-6 text-white">
            Technical Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-lg shadow-md"
              style={cardStyles}
            >
              <h4 className="text-lg font-semibold mb-3 text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                SSL/TLS Security
              </h4>
              <ul className="text-sm text-gray-200 space-y-2">
                <li className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="font-semibold">
                    {shodanData?.ssl?.version || "TLS 1.3+"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Heartbleed:</span>
                  <span
                    className={`font-semibold ${
                      shodanData?.vulns?.includes("CVE-2014-0160")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {shodanData?.vulns?.includes("CVE-2014-0160")
                      ? "Vulnerable"
                      : "Not Vulnerable"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>POODLE:</span>
                  <span
                    className={`font-semibold ${
                      shodanData?.vulns?.includes("CVE-2014-3566")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {shodanData?.vulns?.includes("CVE-2014-3566")
                      ? "Vulnerable"
                      : "TLS Not Affected"}
                  </span>
                </li>
              </ul>
            </div>
            <div
              className="bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-lg shadow-md"
              style={cardStyles}
            >
              <h4 className="text-lg font-semibold mb-3 text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Security Headers
              </h4>
              <ul className="text-sm text-gray-200 space-y-2">
                <li className="flex justify-between">
                  <span>HSTS:</span>
                  <span
                    className={`font-semibold ${
                      shodanData?.http?.headers?.["Strict-Transport-Security"]
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {shodanData?.http?.headers?.["Strict-Transport-Security"]
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>X-Content-Type-Options:</span>
                  <span className="font-semibold">
                    {shodanData?.http?.headers?.["X-Content-Type-Options"] ||
                      "Not set"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>X-Frame-Options:</span>
                  <span className="font-semibold">
                    {shodanData?.http?.headers?.["X-Frame-Options"] ||
                      "Not set"}
                  </span>
                </li>
              </ul>
            </div>
            <div
              className="bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-lg shadow-md"
              style={cardStyles}
            >
              <h4 className="text-lg font-semibold mb-3 text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                Network Information
              </h4>
              <ul className="text-sm text-gray-200 space-y-2">
                <li className="flex justify-between">
                  <span>ASN:</span>
                  <span className="font-semibold">
                    {shodanData?.asn || "N/A"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Anycast:</span>
                  <span
                    className={`font-semibold ${
                      shodanData?.anycast ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {shodanData?.anycast ? "Enabled" : "Disabled"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Domain:</span>
                  <span className="font-semibold">
                    {shodanData?.domains?.[0] || "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* WHOIS Information */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            WHOIS Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <p className="text-gray-300">
                <strong className="text-teal-300">Domain Owner:</strong>{" "}
                {shodanData?.whois?.owner || "N/A"}
              </p>
              <p className="text-gray-300">
                <strong className="text-teal-300">Registration Date:</strong>{" "}
                {shodanData?.whois?.registrationDate || "N/A"}
              </p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <p className="text-gray-300">
                <strong className="text-teal-300">Expiration Date:</strong>{" "}
                {shodanData?.whois?.expirationDate || "N/A"}
              </p>
              <p className="text-gray-300">
                <strong className="text-teal-300">Registrar:</strong>{" "}
                {shodanData?.whois?.registrar || "N/A"}
              </p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <p className="text-gray-300">
                <strong className="text-teal-300">Name Servers:</strong>{" "}
                {shodanData?.whois?.nameServers?.join(", ") || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Security Score Section */}
        {shodanData && shodanData.securityScore !== undefined && (
          <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between items-start">
              <div className="w-1/3">
                <h3 className="text-2xl font-semibold mb-4 text-white">
                  Security Score
                </h3>
                <div
                  className="bg-teal-500 w-32 h-32 rounded-full flex items-center justify-center"
                  style={circularProgressStyles}
                >
                  <span className="text-4xl font-bold text-white">
                    {shodanData.securityScore}
                  </span>
                </div>
              </div>
              <div className="w-2/3">
                <h4 className="text-xl font-semibold mb-2 text-white">
                  Open Ports & Services
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {shodanData.ports?.map((port, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 p-3 rounded-lg flex justify-between items-center"
                    >
                      <span className="text-sm text-white">Port {port}</span>
                      <span className="text-sm text-blue-400 font-semibold">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Historical Data Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            Historical Data
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-4"></div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  SSL Certificate Updated
                </h4>
                <p className="text-sm text-gray-300">2023-07-01 08:30:00 UTC</p>
              </div>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-4"></div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  Security Policy Update
                </h4>
                <p className="text-sm text-gray-300">2023-06-15 14:45:00 UTC</p>
              </div>
            </li>
            <li className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-4"></div>
              <div>
                <h4 className="text-lg font-semibold text-white">
                  DNS Configuration Change
                </h4>
                <p className="text-sm text-gray-300">2023-05-20 10:15:00 UTC</p>
              </div>
            </li>
          </ul>
        </section>

        {/* Security & Threat Intelligence */}
        <SecurityThreatComponent
          greynoiseData={greynoiseData}
          virusTotalData={virusTotalData}
        />

        {/* Risk Analysis */}
        <RiskAnalysisComponent shodanData={shodanData} />

        {/* Related IPs Section */}
        <section className="mb-12 bg-gray-800 bg-opacity-50 rounded-xl shadow-2xl p-8 backdrop-filter backdrop-blur-lg">
          <h3 className="text-2xl font-bold mb-6 text-gray-300">Related IPs</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shodanData?.relatedIPs?.map((ip, index) => (
              <div
                key={index}
                className="bg-gray-700 p-3 rounded-lg text-center hover:bg-gray-600 transition duration-300"
              >
                <p className="text-sm text-white">{ip}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; 2023 CyberSherlock. All rights reserved.{" "}
          <a href="#privacy-policy">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
const InfoItem = ({ label, value }) => (
  <p className="flex justify-between items-center text-gray-300">
    <span className="font-semibold text-gray-400">{label}:</span>
    <span className="text-white">{value || "N/A"}</span>
  </p>
);
