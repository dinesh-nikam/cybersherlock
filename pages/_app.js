import { useState, useEffect } from "react";
import Head from "next/head"; // Import Head for adding meta and link tags
import "../styles/globals.css"; // Assuming you have global styles
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({ Component, pageProps }) {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    // Check and apply the saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkTheme(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkTheme(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newTheme;
    });
  };

  return (
    <>
      <Head>
        {/* Add the Google Fonts link */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        
      </Head>
      <div className="min-h-screen bg-gray-900 text-white dark:bg-gray-900 dark:text-white">
        {/* Theme Toggle Button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleTheme}
            className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-md transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {isDarkTheme ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12h-1m15.07 4.95l-.7-.7M6.34 6.34l-.7-.7m12.02 12.02l-.7-.7M6.34 17.66l-.7-.7M12 5a7 7 0 100 14 7 7 0 000-14z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Render the current page */}
        <Component {...pageProps} />
        <Analytics />
        <SpeedInsights />
      </div>
    </>
  );
}