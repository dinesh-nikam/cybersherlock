import Link from "next/link";

export default function Blogs() {
  const blogPosts = [
    {
      title: "Top 10 Cybersecurity Tips for 2023",
      description:
        "Learn the best practices to protect your personal and business data from cyber threats.",
      link: "/blogs/cybersecurity-tips",
      image: "/images/cybersecurity-tips.jpg", // Replace with the actual image path
    },
    {
      title: "Understanding Ransomware Attacks",
      description:
        "A deep dive into ransomware attacks and how to safeguard your systems.",
      link: "/blogs/ransomware-attacks",
      image: "/images/ransomware.jpg", // Replace with the actual image path
    },
    {
      title: "The Importance of Regular Security Audits",
      description:
        "Discover why regular security audits are crucial for maintaining a secure environment.",
      link: "/blogs/security-audits",
      image: "/images/security-audits.jpg", // Replace with the actual image path
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="navbar">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-accent">
            Cybersecurity Blogs
          </h1>
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
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <section className="text-center py-16">
          <h2 className="text-4xl font-bold mb-6 text-blue-400">
            Explore Our Latest Blogs
          </h2>
          <p className="text-gray-400 mb-12">
            Stay informed with the latest trends and insights in cybersecurity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden"
              >
                {/* Blog Image */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                {/* Blog Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 text-accent">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 mb-6">{post.description}</p>
                  <Link href={post.link} legacyBehavior>
                    <a className="text-blue-400 hover:underline font-semibold">
                      Read More →
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
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

      {/* Subscribe to Our Newsletter */}
      <section id="newsletter" className="bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-accent mb-6">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-gray-400 mb-8">
            Stay updated with the latest cybersecurity news, tips, and insights.
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
    </div>
  );
}
