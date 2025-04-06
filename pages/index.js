import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import logo from "../C_logo.jpg"; // Assuming the logo is saved as logo.png in the public folder

// Dynamically import MapContainer and related Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const [inputType, setInputType] = useState("ip"); // Default to IP
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userIP, setUserIP] = useState(null); // State to store the user's IP address
  const [username, setUsername] = useState(null); // State to store the logged-in username

  useEffect(() => {
    // Check if a user is already logged in
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchAndStoreUserIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setUserIP(data.ip); // Store the user's IP in state

        if (storedUsername) {
          // Store the user's IP in the database
          await fetch("/api/storeUserIP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip: data.ip, username: storedUsername }),
          });
        }
      } catch (error) {
        console.error("Error fetching or storing user IP:", error);
      }
    };

    fetchAndStoreUserIP();
  }, []);

  const validateInput = () => {
    if (inputType === "ip") {
      const ipRegex =
        /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
      if (!ipRegex.test(inputValue)) {
        setError("Invalid IP address. Please enter a valid IP.");
        return false;
      }
    } else if (inputType === "domain") {
      const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
      if (!domainRegex.test(inputValue)) {
        setError("Invalid domain. Please enter a valid domain.");
        return false;
      }
    }
    setError(""); // Clear error if validation passes
    return true;
  };

  const handleSearch = async () => {
    if (validateInput()) {
      const username = localStorage.getItem("username"); // Retrieve the signed-in user's username

      try {
        await fetch("/api/trackSearch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            searchType: inputType,
            searchValue: inputValue,
          }),
        });
      } catch (error) {
        console.error("Error tracking search:", error);
      }

      if (inputType === "ip") {
        router.push(`/results?ip=${inputValue}`);
      } else if (inputType === "domain") {
        router.push(`/resultDomain?domain=${inputValue}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    router.reload(); // Reload the page to reflect the logout state
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <header className="navbar">
        <div className="container">
          {/* Logo */}
          <div className="logo">
            <Image
              src={logo}
              alt="CyberSherlock Logo"
              width={100}
              height={60}
              fetchpriority="high" // Corrected attribute
            />
          </div>

          {/* Navbar Links */}
          <nav className={menuOpen ? "open" : ""}>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <Link href="/pricing" legacyBehavior>
              <a>Pricing</a>
            </Link>
            <Link href="/blogs" legacyBehavior>
              <a>Blogs</a>
            </Link>
            <Link href="/about" legacyBehavior>
              <a>About Me</a>
            </Link>
          </nav>

          {/* User Icon or Sign In/Register Button */}
          <div className="flex items-center">
            {username ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <img
                    src="/images/user_icon.jpg" // Replace with the actual user icon path
                    alt="User Icon"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg hidden group-hover:block">
                    <p className="text-sm text-gray-300 px-4 py-2">
                      Logged in as <span className="font-bold">{username}</span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/signin" legacyBehavior>
                <a className="btn-signin bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  Sign In / Register
                </a>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <section className="text-center py-16 bg-gradient-to-b from-darkSecondary to-darkPrimary">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-accent">Detect.</span>{" "}
            <span className="text-green-400">Analyze.</span>{" "}
            <span className="text-yellow-400">Secure.</span>
          </h2>
          <p className="text-base mb-8 text-gray-400">
            Advanced cybersecurity intelligence platform for comprehensive IP
            and domain analysis.
          </p>
          <div className="flex justify-center items-center gap-4 py-6">
            {/* Toggle Button for IP/Domain */}
            <div className="relative">
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
                onClick={() =>
                  setInputType(inputType === "ip" ? "domain" : "ip")
                }
              >
                {inputType === "ip" ? "IP" : "Domain"}
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-full bg-gray-900 rounded-lg shadow-xl opacity-0 transition-all duration-300 group-hover:opacity-100">
                <ul className="text-white">
                  <li
                    className="px-4 py-2 hover:bg-blue-600 transition-all duration-200 cursor-pointer rounded-t-lg"
                    onClick={() => setInputType("ip")}
                  >
                    IP
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-purple-600 transition-all duration-200 cursor-pointer rounded-b-lg"
                    onClick={() => setInputType("domain")}
                  >
                    Domain
                  </li>
                </ul>
              </div>
            </div>

            {/* Input Field */}
            <input
              type="text"
              placeholder={`Enter ${inputType}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="p-3 w-1/2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-blue-500 text-lg placeholder-gray-400 transition-all duration-300"
            />

            {/* Error Message */}
            {error && (
              <p className="text-red-500 mb-4 animate-pulse">{error}</p>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleSearch}
              className="relative overflow-hidden bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg font-semibold transition-transform transform hover:scale-105 focus:ring-4 focus:ring-green-300"
            >
              Analyze Now
              <span className="absolute inset-0 bg-white opacity-10 hover:opacity-0 transition-all duration-300"></span>
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-900 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-accent mb-12 tracking-wide">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  title: "Geolocation",
                  desc: "Precise IP location tracking with mapping capabilities.",
                  image: "/images/geolocation.gif", // Replace with the actual path to the image or SVG
                },
                {
                  title: "WHOIS Lookup",
                  desc: "Retrieve domain registration and ownership information.",
                  image: "/images/whois_lookup.gif", // Replace with the actual path to the image or SVG
                },
                {
                  title: "Security Analysis",
                  desc: "Comprehensive IP intelligence and vulnerability assessment.",
                  image: "/images/security.gif", // Replace with the actual path to the GIF
                },
                {
                  title: "Threat Detection",
                  desc: "Real-time malicious activity monitoring and alerts.",
                  image: "/images/threat_detection.gif", // Replace with the actual path to the image or SVG
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 text-white"
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-12 h-12 mb-4 mx-auto"
                  />
                  <h4 className="text-xl font-bold mb-2 text-blue-400">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-gray-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-white mb-12 tracking-wide">
              Trusted by Security Experts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  image: "/images/geolocation.gif",
                  name: "James Wilson",
                  role: "CEO, TechCorp",
                  text: "CyberSherlock has been a game-changer for our threat detection and IP analysis.",
                },
                {
                  name: "Sarah Chen",
                  role: "Security Analyst",
                  text: "The most comprehensive tool I've used for cybersecurity intelligence.",
                },
                {
                  name: "Michael Brown",
                  role: "IT Security Advisor",
                  text: "Essential for any business dealing with sensitive network data.",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 text-white"
                >
                  <img
                    src={testimonial.image}
                    className="w-12 h-12 mb-4 mx-auto"
                  />
                  <p className="italic text-gray-300">"{testimonial.text}"</p>
                  <h4 className="mt-4 font-bold text-blue-400">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="bg-gray-900 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-accent mb-12 tracking-wide">
              Security Certifications
            </h3>
            <p className="text-gray-400 mb-8">
              Trusted and certified by leading security organizations.
            </p>
            <div className="flex justify-center gap-8">
              {[
                {
                  name: "ISO 27001",
                  image: "/Images/iso_certified.gif", // Correct path
                },
                {
                  name: "SOC 2 Type II",
                  image: "/Images/soc.gif", // Correct path
                },
                {
                  name: "GDPR Compliant",
                  image: "/Images/lock.gif", // Correct path
                },
              ].map((cert, index) => (
                <div
                  key={index}
                  className="bg-gray-800 px-6 py-4 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 text-white"
                >
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-12 h-12 mb-4 mx-auto"
                  />
                  <p className="text-lg font-semibold">{cert.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stylish Component to Display User's IP */}
        {/* {userIP && (
          <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 px-4 rounded-lg shadow-lg mx-auto max-w-4xl text-center mb-16">
            <h3 className="text-2xl font-bold mb-4">
              Your IP Address is:{" "}
              <span className="text-yellow-300">{userIP}</span>
            </h3>
            <p className="text-lg">
              Protect your IP address from online theft and ensure your online
              activities remain secure.
            </p>
          </section>
        )} */}

        {/* Subscribe to Our Newsletter */}
        <section id="newsletter" className="bg-gray-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-accent mb-6">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-400 mb-8">
              Stay updated with the latest cybersecurity news, tips, and
              insights.
            </p>
            <form className="flex flex-col md:flex-row justify-center items-center gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 w-full md:w-1/2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-blue-500 text-lg placeholder-gray-400 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          &copy; 2025 CyberSherlock. All rights reserved.{" "}
          <a href="#privacy-policy">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
