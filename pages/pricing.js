import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "Basic IP and Domain Lookup",
        "Limited API Access",
        "Community Support",
      ],
      buttonText: "Get Started",
      buttonStyle: "bg-gray-500 hover:bg-gray-600",
    },
    {
      name: "Pro",
      price: "$19.99/month",
      features: [
        "Advanced Threat Intelligence",
        "Unlimited API Access",
        "Priority Support",
      ],
      buttonText: "Subscribe Now",
      buttonStyle: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      features: [
        "Dedicated Account Manager",
        "Custom Integrations",
        "24/7 Support",
      ],
      buttonText: "Contact Us",
      buttonStyle: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="navbar">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-accent">Pricing Plans</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" legacyBehavior>
                  <a className="hover:text-blue-400 transition">Home</a>
                </Link>
              </li>
              <li>
                <Link href="#features" legacyBehavior>
                  <a className="hover:text-blue-400 transition">Features</a>
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
            Choose the Plan That Fits Your Needs
          </h2>
          <p className="text-gray-400 mb-12">
            Whether you're an individual or a business, we have a plan for you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
              >
                <h3 className="text-2xl font-bold mb-4 text-accent">
                  {plan.name}
                </h3>
                <p className="text-4xl font-extrabold mb-6">{plan.price}</p>
                <ul className="text-gray-300 space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`${plan.buttonStyle} text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p className="text-center">
          &copy; 2023 CyberSherlock. All rights reserved.{" "}
          <a href="#privacy-policy" className="hover:text-blue-400">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}
