import { useRouter } from "next/router";

export default function Report() {
  const router = useRouter();
  const {
    ipinfoData,
    greynoiseData,
    securityTrailsData,
    virusTotalData,
    censysData,
    shodanData,
    whoisData,
  } = router.query;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <header className="navbar">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-accent">
            CyberSherlock Report
          </h1>
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

      <main className="container mx-auto p-4">
        {/* IPinfo Section */}
        {ipinfoData && (
          <section className="bg-gray-800 p-4 rounded shadow mb-8">
            <h3 className="text-lg font-semibold mb-2">IPinfo Data</h3>
            <pre className="text-sm bg-gray-700 p-2 rounded">
              {JSON.stringify(JSON.parse(ipinfoData), null, 2)}
            </pre>
          </section>
        )}

        {/* GreyNoise Section */}
        {greynoiseData && (
          <section className="bg-gray-800 p-4 rounded shadow mb-8">
            <h3 className="text-lg font-semibold mb-2">GreyNoise Data</h3>
            <pre className="text-sm bg-gray-700 p-2 rounded">
              {JSON.stringify(JSON.parse(greynoiseData), null, 2)}
            </pre>
          </section>
        )}

        {/* SecurityTrails Section */}
        {securityTrailsData && (
          <section className="bg-gray-800 p-4 rounded shadow mb-8">
            <h3 className="text-lg font-semibold mb-2">SecurityTrails Data</h3>
            <pre className="text-sm bg-gray-700 p-2 rounded">
              {JSON.stringify(JSON.parse(securityTrailsData), null, 2)}
            </pre>
          </section>
        )}

        {/* VirusTotal Section */}
        {virusTotalData && (
          <section className="bg-gray-800 p-4 rounded shadow mb-8">
            <h3 className="text-lg font-semibold mb-2">VirusTotal Data</h3>
            <pre className="text-sm bg-gray-700 p-2 rounded">
              {JSON.stringify(JSON.parse(virusTotalData), null, 2)}
            </pre>
          </section>
        )}

        {/* Censys Section */}
        {censysData && (
          <section className="bg-gray-800 p-4 rounded shadow mb-8">
            <h3 className="text-lg font-semibold mb-2">Censys Data</h3>
            <pre className="text-sm bg-gray-700 p-2 rounded">
              {JSON.stringify(JSON.parse(censysData), null, 2)}
            </pre>
          </section>
        )}

        {/* Shodan Section */}
        {shodanData && (
          <section className="bg-gray-800 p-4 rounded shadow mb-8">
            <h3 className="text-lg font-semibold mb-2">Shodan Data</h3>
            <pre className="text-sm bg-gray-700 p-2 rounded">
              {JSON.stringify(JSON.parse(shodanData), null, 2)}
            </pre>
          </section>
        )}

        {/* WHOIS Data */}
        {whoisData && (
          <section className="bg-gray-800 p-4 rounded shadow mb-8">
            <h3 className="text-lg font-semibold mb-2">WHOIS Data</h3>
            <pre className="text-sm bg-gray-700 p-2 rounded">
              {JSON.stringify(JSON.parse(whoisData), null, 2)}
            </pre>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          &copy; 2023 CyberSherlock. All rights reserved.{" "}
          <a href="#privacy-policy">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
