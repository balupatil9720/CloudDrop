import { useEffect, useState } from "react";
import api from "../utils/api";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await api.get("/files");
      setFiles(response.data.data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  const handleFileDownload = async (id) => {
    try {
      const response = await api.get(`/files/download/${id}`);
      window.open(response.data.data.url, "_blank");
    } catch (error) {
      alert(error.response?.data?.message || "Download failed. Please try again.");
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
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Access Code Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Quick Access</h3>
              <p className="text-white/80 text-xs">Retrieve any file using its access code</p>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter 6-digit access code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase().slice(0, 6))}
              className="flex-1 px-4 py-2.5 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-white/50 font-mono text-center tracking-wider"
              maxLength={6}
            />
            <button
              onClick={handleCodeDownload}
              disabled={isLoading}
              className="bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
            >
              {isLoading ? "Processing..." : "Retrieve"}
            </button>
          </div>
        </div>
      </div>

      {/* File List Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your Files</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage and track your uploaded files</p>
          </div>
          <div className="text-sm text-gray-400">
            {files.length} {files.length === 1 ? "file" : "files"}
          </div>
        </div>

        {files.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 font-medium">No files uploaded yet</p>
            <p className="text-sm text-gray-400 mt-1">Upload your first file to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {files.map((file) => {
              const isExpired = new Date() > new Date(file.expiresAt);
              const fileSizeKB = (file.fileSize / 1024).toFixed(2);
              const fileSizeMB = (file.fileSize / (1024 * 1024)).toFixed(2);
              const displaySize = file.fileSize > 1024 * 1024 ? `${fileSizeMB} MB` : `${fileSizeKB} KB`;

              return (
                <div
                  key={file._id}
                  className={`bg-white rounded-xl shadow-lg border transition-all ${
                    isExpired ? "border-gray-200 opacity-75" : "border-gray-200 hover:shadow-xl"
                  }`}
                >
                  <div className="p-5">
                    {/* File Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          file.isGuest ? "bg-amber-100" : "bg-indigo-100"
                        }`}>
                          <svg className={`w-5 h-5 ${
                            file.isGuest ? "text-amber-600" : "text-indigo-600"
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {file.fileName}
                          </h3>
                          <p className="text-xs text-gray-500">{displaySize}</p>
                        </div>
                      </div>
                      
                      {/* Status Badges */}
                      <div className="flex flex-col items-end gap-1">
                        {isExpired ? (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            Expired
                          </span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Active
                          </span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          file.isGuest
                            ? "bg-amber-100 text-amber-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}>
                          {file.isGuest ? "Guest (2 days)" : "Premium (21 days)"}
                        </span>
                      </div>
                    </div>

                    {/* File Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Expires on:</span>
                        <span className="text-gray-700 font-medium">
                          {new Date(file.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Access Code:</span>
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono font-bold text-gray-800">
                            {file.code}
                          </code>
                          <button
                            onClick={() => copyToClipboard(file.code)}
                            className="text-indigo-600 hover:text-indigo-700 text-xs font-medium"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      disabled={isExpired}
                      onClick={() => handleFileDownload(file._id)}
                      className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                        isExpired
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-sm"
                      }`}
                    >
                      {isExpired ? "File Expired" : "Download File"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;