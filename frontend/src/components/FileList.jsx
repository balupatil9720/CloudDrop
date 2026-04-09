import { useEffect, useState } from "react";
import api from "../utils/api";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [codeInput, setCodeInput] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await api.get("/files");
      setFiles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadFile = async (id) => {
    try {
      const res = await api.get(`/files/download/${id}`);
      window.open(res.data.data.url, "_blank");
    } catch (err) {
      alert(err.response?.data?.message || "Download failed");
    }
  };

  const downloadByCode = async () => {
    if (!codeInput) return alert("Enter code");

    try {
      const res = await api.get(`/files/code/${codeInput}`);
      window.open(res.data.data.url, "_blank");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid code");
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="space-y-8">

      {/* 🔐 ACCESS VIA CODE */}
      <div className="bg-linear-to-r from-indigo-500 to-blue-500 p-6 rounded-2xl shadow-lg text-white">
        <h2 className="text-xl font-semibold mb-3">
          🔑 Access File via Code
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg text-black outline-none"
          />

          <button
            onClick={downloadByCode}
            className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Get File
          </button>
        </div>
      </div>

      {/* 📂 FILE LIST */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          📂 Uploaded Files
        </h2>

        {files.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No files uploaded yet 🚀
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {files.map((file) => {
              const isExpired = new Date() > new Date(file.expiresAt);

              return (
                <div
                  key={file._id}
                  className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition border"
                >
                  {/* File Info */}
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800">
                      {file.fileName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {(file.fileSize / 1024).toFixed(2)} KB
                    </p>

                    <p className="text-xs text-gray-500">
                      Expires:{" "}
                      {new Date(file.expiresAt).toLocaleDateString()}
                    </p>

                    {/* Status */}
                    {isExpired ? (
                      <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Expired
                      </span>
                    ) : (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Code + Actions */}
                  <div className="mt-4 flex justify-between items-center">

                    {/* Code */}
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-200 px-3 py-1 text-sm rounded-lg font-mono">
                        {file.code}
                      </span>

                      <button
                        onClick={() => copyCode(file.code)}
                        className="text-blue-500 text-xs hover:underline"
                      >
                        Copy
                      </button>
                    </div>

                    {/* Download */}
                    <button
                      disabled={isExpired}
                      onClick={() => downloadFile(file._id)}
                      className={`px-4 py-1.5 rounded-lg text-white text-sm transition ${
                        isExpired
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      Download
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