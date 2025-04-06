import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ResultDomain() {
  const router = useRouter();
  const { domain } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ipinfoData, setIpinfoData] = useState(null);
  const [greynoiseData, setGreynoiseData] = useState(null);
  const [securityTrailsData, setSecurityTrailsData] = useState(null);
  const [virusTotalData, setVirusTotalData] = useState(null);
  const [censysData, setCensysData] = useState(null);
  const [shodanData, setShodanData] = useState(null);

  useEffect(() => {
    if (domain) {
      const fetchData = async () => {
        try {
          const [
            ipinfo,
            greynoise,
            securitytrails,
            virustotal,
            censys,
            shodan,
          ] = await Promise.all([
            fetch("/api/proxy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip: domain, type: "ipinfo" }),
            }).then((res) => res.json()),
            fetch("/api/proxy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip: domain, type: "greynoise" }),
            }).then((res) => res.json()),
            fetch("/api/proxy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ domain, type: "securitytrails" }),
            }).then((res) => res.json()),
            fetch("/api/proxy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip: domain, type: "virustotal" }),
            }).then((res) => res.json()),
            fetch("/api/proxy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip: domain, type: "censys" }),
            }).then((res) => res.json()),
            fetch("/api/proxy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ip: domain, type: "shodan" }),
            }).then((res) => res.json()),
          ]);

          setIpinfoData(ipinfo);
          setGreynoiseData(greynoise);
          setSecurityTrailsData(securitytrails);
          setVirusTotalData(virustotal);
          setCensysData(censys);
          setShodanData(shodan);
        } catch (error) {
          setError("Failed to fetch domain data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [domain]);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (
    !ipinfoData &&
    !greynoiseData &&
    !securityTrailsData &&
    !virusTotalData &&
    !censysData &&
    !shodanData
  )
    return <div className="text-center text-red-500">No data found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="navbar">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-accent">Domain Details</h1>
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
        {/* Domain Details Section */}
        <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-lg mb-8 border border-gray-700">
          <h2 className="text-4xl font-extrabold text-center text-blue-400 mb-6 tracking-wide">
            🌐 Domain Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-gradient-to-b from-blue-800 to-blue-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold text-blue-300 mb-4">
                General Info
              </h3>
              <ul className="text-sm text-gray-200 space-y-2">
                <li>Country: {ipinfoData?.country || "N/A"}</li>
                <li>City: {ipinfoData?.city || "N/A"}</li>
                <li>Region: {ipinfoData?.region || "N/A"}</li>
                <li>Organization: {ipinfoData?.org || "N/A"}</li>
                <li>Location: {ipinfoData?.loc || "N/A"}</li>
              </ul>
            </div>

            {/* Right Column */}
            <div className="bg-gradient-to-b from-purple-800 to-purple-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-bold text-purple-300 mb-4">
                Technical Info
              </h3>
              <ul className="text-sm text-gray-200 space-y-2">
                <li>ISP: {shodanData?.isp || "N/A"}</li>
                <li>ASN: {shodanData?.asn || "N/A"}</li>
                <li>Ports: {shodanData?.ports?.join(", ") || "None"}</li>
                <li>Vulnerabilities: {shodanData?.vulns?.length || 0}</li>
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
                {securityTrailsData?.owner || "N/A"}
              </p>
              <p className="text-gray-300">
                <strong className="text-teal-300">Registrar:</strong>{" "}
                {securityTrailsData?.registrar || "N/A"}
              </p>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <p className="text-gray-300">
                <strong className="text-teal-300">Registration Date:</strong>{" "}
                {securityTrailsData?.registrationDate || "N/A"}
              </p>
              <p className="text-gray-300">
                <strong className="text-teal-300">Expiration Date:</strong>{" "}
                {securityTrailsData?.expirationDate || "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* GreyNoise Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-bold text-white mb-4">GreyNoise Data</h3>
          <ul className="text-sm text-gray-200 space-y-2">
            <li>Noise: {greynoiseData?.noise ? "Yes" : "No"}</li>
            <li>
              Classification: {greynoiseData?.classification || "Unknown"}
            </li>
            <li>Name: {greynoiseData?.name || "N/A"}</li>
          </ul>
        </section>

        {/* VirusTotal Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-bold text-white mb-4">VirusTotal Data</h3>
          <ul className="text-sm text-gray-200 space-y-2">
            <li>
              Malicious:{" "}
              {virusTotalData?.data?.attributes?.last_analysis_stats
                ?.malicious || 0}
            </li>
            <li>
              Harmless:{" "}
              {virusTotalData?.data?.attributes?.last_analysis_stats
                ?.harmless || 0}
            </li>
          </ul>
        </section>

        {/* Censys Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Censys Data</h3>
          <ul className="text-sm text-gray-200 space-y-2">
            <li>Host Info: {censysData?.result || "N/A"}</li>
            <li>Certificates: {censysData?.certificates || "N/A"}</li>
          </ul>
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
