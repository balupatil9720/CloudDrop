import { useState } from "react";
import api from "../utils/api";

const Upload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [uploadedCode, setUploadedCode] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await api.post("/files/upload", formData);

      const fileData = res.data.data;

      // 🔥 SHOW MODAL
      setUploadedCode(fileData.code);
      setShowModal(true);

      setFile(null);
      onUploadSuccess();
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
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">

      <h2 className="text-lg font-semibold">📤 Upload File</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded-lg w-full"
      />

      {file && <p className="text-sm text-gray-600">📄 {file.name}</p>}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* 🔥 MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-2xl shadow-xl w-80 text-center space-y-4">

            <h2 className="text-xl font-bold text-green-600">
              ✅ Upload Successful
            </h2>

            <p className="text-gray-600">Your file code:</p>

            <div className="bg-gray-100 py-2 rounded text-lg font-mono tracking-widest">
              {uploadedCode}
            </div>

            <p className="text-xs text-red-500">
              ⚠️ Save this code — required to access file
            </p>

            <div className="flex gap-3">
              <button
                onClick={copyCode}
                className="flex-1 bg-blue-500 text-white py-2 rounded"
              >
                Copy
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 py-2 rounded"
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

export default Upload;