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

  // 🔑 Download via code
  const handleDownload = async () => {
    if (!code) return alert("Enter code");

    try {
      const res = await api.get(`/files/code/${code}`);
      window.open(res.data.data.url, "_blank");
    } catch {
      alert("Invalid or expired code");
    }
  };

  // 📤 Guest upload
  const handleUpload = async () => {
    if (!file) return alert("Select a file");

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
    alert("Code copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-green-700 text-white flex flex-col">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-5">
        <h1 className="text-2xl font-bold">☁️ CloudDrop</h1>

        <div className="space-x-4">
          <button onClick={() => navigate("/login")}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg">
            Login
          </button>

          <button onClick={() => navigate("/signup")}
            className="bg-blue-500 px-4 py-2 rounded-lg">
            Signup
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col items-center justify-center flex-1 gap-10 px-6">

        <h1 className="text-4xl font-bold text-center">
          Share Files Instantly ⚡
        </h1>

        {/* Code Access */}
        <div className="bg-white/10 p-6 rounded-xl w-full max-w-md">
          <h2 className="mb-3 font-semibold">Access via Code</h2>

          <div className="flex gap-3">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 rounded text-black"
            />

            <button
              onClick={handleDownload}
              className="bg-white text-red-600 px-4 py-2 rounded"
            >
              Get
            </button>
          </div>
        </div>

        {/* Guest Upload */}
        <div className="bg-white/10 p-6 rounded-xl w-full max-w-md">
          <h2 className="mb-3 font-semibold">
            Upload as Guest (2 days expiry)
          </h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-3"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-white text-blue-600 py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl"
        >
          Login for 21-day storage 🚀
        </button>
      </div>
      {/* 🔥 PROFESSIONAL MODAL */}
{showModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center space-y-5 animate-fadeIn">

      {/* Icon */}
      <div className="flex justify-center">
        <div className="bg-green-100 text-green-600 w-14 h-14 flex items-center justify-center rounded-full text-2xl">
          ✓
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800">
        Upload Successful
      </h2>

      {/* Subtitle */}
      <p className="text-sm text-gray-500">
        Use this code to access or share your file
      </p>

      {/* Code Box */}
      <div className="bg-gray-100 border border-gray-200 py-3 rounded-xl text-xl font-mono tracking-widest text-gray-800">
        {uploadedCode}
      </div>

      {/* Warning */}
      <p className="text-xs text-red-500">
        ⚠️ Save this code — it won't be shown again
      </p>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">

        <button
          onClick={copyCode}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          Copy Code
        </button>

        <button
          onClick={() => setShowModal(false)}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition"
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