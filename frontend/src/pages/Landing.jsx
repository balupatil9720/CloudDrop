import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-5">
        <h1 className="text-2xl font-bold">☁️ CloudDrop</h1>

        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-200">
            Login
          </Link>
          <Link to="/signup" className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition">
            Signup
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <h2 className="text-5xl font-extrabold mb-6">
          Share Files Instantly 🚀
        </h2>

        <p className="text-lg max-w-xl mb-8 text-gray-200">
          Upload, share, and access files securely using a simple 6-digit code.
          Fast, reliable, and cloud-powered.
        </p>

        <div className="space-x-4">
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-200"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-10 pb-20 text-center">
        <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-2">⚡ Fast Upload</h3>
          <p className="text-gray-200">Upload files quickly with cloud storage.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-2">🔐 Secure Access</h3>
          <p className="text-gray-200">Access files using unique 6-digit codes.</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl backdrop-blur-md">
          <h3 className="text-xl font-semibold mb-2">⏳ Auto Expiry</h3>
          <p className="text-gray-200">Files automatically expire for safety.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;