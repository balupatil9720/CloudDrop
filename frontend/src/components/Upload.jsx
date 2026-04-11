import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const Upload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    // 🔥 VALIDATION
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Max file size is 100MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await api.post("/files/upload", formData);

      setGeneratedCode(response.data.data.code);
      setIsModalOpen(true);
      setFile(null);

      toast.success("File uploaded successfully");

      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 COPY + CLOSE MODAL
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success("Code copied!");
      setIsModalOpen(false); // close modal
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border p-5">

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {file && (
          <p className="text-xs text-gray-500 mt-2">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        )}

        <p className="text-xs text-gray-400 mt-2">
          Max size: 10MB (Guest) / 100MB (User)
        </p>

        <button
          onClick={handleFileUpload}
          disabled={isLoading}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-5 rounded-lg text-center w-80">
            <h3 className="font-semibold mb-2">Upload Successful</h3>

            <p className="text-sm text-gray-500 mb-2">
              Access Code
            </p>

            <p className="font-mono text-2xl font-bold text-indigo-600 mb-3">
              {generatedCode}
            </p>

            <button
              onClick={copyToClipboard}
              className="w-full bg-indigo-600 text-white py-2 rounded mb-2"
            >
              Copy Code
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full border border-gray-300 py-2 rounded text-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;