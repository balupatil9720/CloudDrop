import { useEffect, useState } from "react";
import api from "../utils/api";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storage, setStorage] = useState(null);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/files");
      setFiles(response.data.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  const fetchStorage = async () => {
    try {
      const res = await api.get("/files/storage");
      setStorage(res.data.data);
    } catch (err) {
      console.log("Storage fetch failed");
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "Expired";

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    return `${d}d ${h}h ${m}m`;
  };

  const handleFileDownload = async (id) => {
    try {
      const response = await api.get(`/files/download/${id}`);
      window.open(response.data.data.url, "_blank");
      fetchFiles(); // refresh download count
    } catch (error) {
      alert(error.response?.data?.message || "Download failed.");
    }
  };

  const handleCodeDownload = async () => {
    if (!accessCode.trim()) {
      alert("Please enter an access code");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/files/code/${accessCode}`);
      window.open(response.data.data.url, "_blank");
      setAccessCode("");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid or expired access code");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
  };

  useEffect(() => {
    fetchFiles();
    fetchStorage();
  }, []);

  return (
    <div className="space-y-8">

      {/* 🔥 STORAGE CARD */}
      {storage && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
          <h3 className="text-sm text-gray-500">Storage Usage</h3>
          <p className="text-xl font-semibold text-indigo-600">
            {(storage.totalUsed / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {storage.totalFiles} files stored
          </p>
        </div>
      )}

      {/* Access Code Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-5">
          <h3 className="text-white font-semibold mb-3">Quick Access</h3>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter 6-digit access code"
              value={accessCode}
              onChange={(e) =>
                setAccessCode(e.target.value.toUpperCase().slice(0, 6))
              }
              className="flex-1 px-4 py-2 rounded-lg text-gray-900 outline-none font-mono text-center"
              maxLength={6}
            />
            <button
              onClick={handleCodeDownload}
              disabled={isLoading}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg"
            >
              {isLoading ? "Loading..." : "Retrieve"}
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="grid md:grid-cols-2 gap-5">
        {files.map((file) => {
          const isExpired = new Date() > new Date(file.expiresAt);
          const fileSizeMB = (file.fileSize / (1024 * 1024)).toFixed(2);

          return (
            <div key={file._id} className="bg-white rounded-xl shadow p-5">

              <h3 className="font-semibold text-gray-900">
                {file.fileName}
              </h3>

              <p className="text-xs text-gray-500">{fileSizeMB} MB</p>

              {/* 🔥 NEW FEATURES */}
              <p className="text-xs text-gray-600 mt-1">
                ⏳ {formatTime(file.expiresIn)}
              </p>

              <p className="text-xs text-gray-600">
                📥 {file.downloadCount} downloads
              </p>

              <div className="flex items-center justify-between mt-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                  {file.code}
                </code>
                <button
                  onClick={() => copyToClipboard(file.code)}
                  className="text-indigo-600 text-xs"
                >
                  Copy
                </button>
              </div>

              <button
                disabled={isExpired}
                onClick={() => handleFileDownload(file._id)}
                className={`mt-3 w-full py-2 rounded-lg ${
                  isExpired
                    ? "bg-gray-100 text-gray-400"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {isExpired ? "Expired" : "Download"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileList;