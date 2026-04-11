import { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

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
      toast.error("Failed to load files");
    }
  };

  const fetchStorage = async () => {
    try {
      const res = await api.get("/files/storage");
      setStorage(res.data.data);
    } catch {
      console.log("Storage fetch failed");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ FIXED DOWNLOAD HANDLER
  const handleFileDownload = async (id) => {
    try {
      const response = await api.get(`/files/download/${id}`);

      window.open(response.data.data.url, "_blank");

      // 🔥 Wait then refresh (important)
      setTimeout(() => {
        fetchFiles();
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Download failed");
    }
  };

  const handleCodeDownload = async () => {
    if (!accessCode.trim()) {
      toast.error("Enter access code");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.get(`/files/code/${accessCode.trim()}`);

      window.open(response.data.data.url, "_blank");

      toast.success("File retrieved");
      setAccessCode("");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  useEffect(() => {
    fetchFiles();
    fetchStorage();

    // 🔥 AUTO REFRESH ON TAB FOCUS (VERY IMPORTANT)
    const handleFocus = () => {
      fetchFiles();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="space-y-8">

      {/* STORAGE */}
      {storage && (
        <div className="bg-white rounded-xl shadow border p-5">
          <h3 className="text-sm text-gray-500">Storage Usage</h3>
          <p className="text-xl font-semibold text-indigo-600">
            {(storage.totalUsed / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {storage.totalFiles} files stored
          </p>
        </div>
      )}

      {/* ACCESS CODE */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3">Quick Access</h3>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={accessCode}
            onChange={(e) =>
              setAccessCode(e.target.value.trim().toUpperCase())
            }
            className="flex-1 px-4 py-2 rounded-lg text-gray-900 text-center"
          />

          <button
            onClick={handleCodeDownload}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg"
          >
            {isLoading ? "Loading..." : "Retrieve"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-4 py-3">Sr</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Downloads</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file, index) => {
              const isExpired = new Date() > new Date(file.expiresAt);

              return (
                <tr key={file._id} className="border-b hover:bg-gray-50">

                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3 font-medium text-indigo-600">
                    {file.fileName}
                  </td>

                  <td className="px-4 py-3">
                    {file.fileName.split(".").pop()}
                  </td>

                  <td className="px-4 py-3">
                    {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                  </td>

                  <td className="px-4 py-3">
                    {formatDate(file.createdAt)}
                  </td>

                  <td className={`px-4 py-3 ${
                    isExpired ? "text-red-500" : "text-green-600"
                  }`}>
                    {formatDate(file.expiresAt)}
                  </td>

                  <td className="px-4 py-3">
                    {file.downloadCount}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{file.code}</span>
                      <button
                        onClick={() => copyToClipboard(file.code)}
                        className="text-indigo-600 text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      disabled={isExpired}
                      onClick={() => handleFileDownload(file._id)}
                      className={`px-3 py-1 rounded ${
                        isExpired
                          ? "bg-gray-200 text-gray-400"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {isExpired ? "Expired" : "Download"}
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default FileList;