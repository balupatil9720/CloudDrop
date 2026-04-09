import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Landing = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!code) return alert("Enter code");

    try {
      setLoading(true);

      const res = await api.get(`/files/code/${code}`);

      window.open(res.data.data.url, "_blank");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold">☁️ CloudDrop</h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-blue-500 border border-white rounded-lg hover:bg-blue-700"
          >
            Signup
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">

        <h1 className="text-5xl font-bold mb-4">
          Share Files Instantly ⚡
        </h1>

        <p className="text-lg text-gray-200 mb-8 max-w-xl">
          Upload, store and share files securely using simple codes or links.
          No hassle. No limits.
        </p>

        {/* 🔑 CODE DOWNLOAD FEATURE */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg flex flex-col items-center gap-4 w-full max-w-md">

          <h2 className="text-xl font-semibold">
            🔑 Access File via Code
          </h2>

          <div className="flex w-full gap-3">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg text-black outline-none"
            />

            <button
              onClick={handleDownload}
              disabled={loading}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
            >
              {loading ? "Loading..." : "Get File"}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-200"
          >
            Get Started 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;