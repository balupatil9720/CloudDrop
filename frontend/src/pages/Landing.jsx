import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Landing = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadedCode, setUploadedCode] = useState("");

  const handleDownload = async () => {
    if (!code) return alert("Please enter a code");

    try {
      const res = await api.get(`/files/code/${code}`);
      window.open(res.data.data.url, "_blank");
    } catch {
      alert("Invalid or expired code");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await api.post("/files/upload", formData);
      const fileData = res.data.data;

      setUploadedCode(fileData.code);
      setShowModal(true);
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(uploadedCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white flex flex-col">

      <div className="flex justify-between items-center px-10 py-6 backdrop-blur-md bg-white/5 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide">
          ☁️ CloudDrop
        </h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-lg bg-white text-indigo-600 font-medium hover:scale-105 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition font-medium"
          >
            Signup
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-12">

        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl font-extrabold leading-tight">
            Share Files <span className="text-yellow-300">Instantly</span>
          </h1>

          <p className="text-lg text-white/80">
            Fast, secure, and effortless file sharing with temporary access codes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 hover:scale-[1.02] transition">
            <h2 className="mb-4 font-semibold text-lg">
              Access via Code
            </h2>

            <div className="flex gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter access code"
                className="flex-1 px-4 py-2 rounded-lg text-black outline-none"
              />

              <button
                onClick={handleDownload}
                className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Get
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20 hover:scale-[1.02] transition">
            <h2 className="mb-4 font-semibold text-lg">
              Upload as Guest
            </h2>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full mb-4 text-sm"
            />

            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>

            <p className="text-xs text-white/70 mt-2">
              File expires in 48 hours
            </p>
          </div>

        </div>

        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
        >
          Get 21-Day Storage 🚀
        </button>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white text-black w-full max-w-sm rounded-2xl shadow-2xl p-7 text-center space-y-5 animate-fadeIn">

            <div className="flex justify-center">
              <div className="bg-green-100 text-green-600 w-14 h-14 flex items-center justify-center rounded-full text-2xl font-bold">
                ✓
              </div>
            </div>

            <h2 className="text-xl font-bold">
              Upload Successful
            </h2>

            <p className="text-sm text-gray-500">
              Share this secure access code
            </p>

            <div className="bg-gray-100 border py-3 rounded-xl text-xl font-mono tracking-widest">
              {uploadedCode}
            </div>

            <p className="text-xs text-red-500">
              Save this code — it will not be shown again
            </p>

            <div className="flex gap-3">
              <button
                onClick={copyCode}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
              >
                Copy
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg font-medium transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;