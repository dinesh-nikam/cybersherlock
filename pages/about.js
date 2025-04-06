import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Head>
        {/* Add the Google Fonts link */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header */}
      <header className="navbar">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-accent">About Me</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" legacyBehavior>
                  <a className="hover:text-blue-400 transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/pricing" legacyBehavior>
                  <a className="hover:text-blue-400 transition">Pricing</a>
                </Link>
              </li>
              <li>
                <Link href="/blogs" legacyBehavior>
                  <a className="hover:text-blue-400 transition">Blogs</a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-lg mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center">
            {/* Profile Image */}
            <div className="w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden shadow-lg mb-6 md:mb-0 md:mr-8">
              <Image
                src="/images/profile.jpg" // Replace with the actual profile image path
                alt="Profile Picture"
                width={240}
                height={240}
                className="object-cover"
              />
            </div>

            {/* About Text */}
            <div>
              <h2 className="text-4xl font-bold text-blue-400 mb-4">
                Hello, I'm [Your Name]!
              </h2>
              <p className="text-gray-300 text-lg mb-4">
                I am a passionate cybersecurity enthusiast with a deep interest
                in protecting digital assets and ensuring online safety. With
                years of experience in threat analysis, vulnerability
                assessment, and penetration testing, I aim to make the internet
                a safer place for everyone.
              </p>
              <p className="text-gray-300 text-lg">
                When I'm not working on cybersecurity projects, I enjoy
                exploring new technologies, writing blogs, and sharing my
                knowledge with the community.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">My Skills</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Penetration Testing",
              "Threat Analysis",
              "Vulnerability Assessment",
              "Network Security",
              "Web Application Security",
              "Incident Response",
              "Cryptography",
              "Cloud Security",
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <p className="text-lg font-semibold text-blue-400">{skill}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-8 px-4 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
          <p className="text-lg mb-6">
            Feel free to reach out to me for collaborations, consultations, or
            just to say hi!
          </p>
          <a
            href="mailto:your-email@example.com"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Contact Me
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer bg-gray-800 py-6">
        <p className="text-center text-gray-400">
          &copy; 2025 CyberSherlock. All rights reserved.{" "}
          <a href="#privacy-policy" className="hover:text-blue-400">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}
