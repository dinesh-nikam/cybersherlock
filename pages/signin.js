import Link from "next/link";

export default function SignIn() {
  const handleSignIn = async (e) => {
    e.preventDefault();
    const username = e.target.username.value; // Assuming a username field exists
    const password = e.target.password.value;

    try {
      // Simulate sign-in logic (replace with actual authentication logic)
      if (username && password) {
        localStorage.setItem("username", username); // Store the username in localStorage
        alert("Sign-in successful!");
        window.location.href = "/"; // Redirect to the home page
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Sign In / Register
        </h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/register" legacyBehavior>
            <a className="text-blue-400 hover:underline">Register here</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
