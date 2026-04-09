import { useEffect, useState } from "react";
import api from "../utils/api";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [codeInput, setCodeInput] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await api.get(`${API_BASE}/files`);
      setFiles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadFile = async (id) => {
    try {
      const res = await api.get(`${API_BASE}/files/download/${id}`);
      window.open(res.data.data.url, "_blank");
    } catch (err) {
      alert(err.response?.data?.message || "Download failed");
    }
  };

  const downloadByCode = async () => {
    if (!codeInput) return alert("Enter code");

    try {
      const res = await api.get(`${API_BASE}/files/code/${codeInput}`);
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
    <div className="p-6 space-y-6">

      {/* 🔐 ACCESS VIA CODE */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Access File via Code
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
          />

          <button
            onClick={downloadByCode}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Get File
          </button>
        </div>
      </div>

      {/* 📂 FILE LIST */}
      <div className="p-5 border rounded-xl bg-gray-50 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          Uploaded Files
        </h2>

        {files.length === 0 ? (
          <p>No files uploaded</p>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => {
              const isExpired = new Date() > new Date(file.expiresAt);

              return (
                <li
                  key={file._id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between"
                >
                  <div>
                    <p className="font-medium">{file.fileName}</p>

                    <p className="text-xs text-gray-500">
                      {(file.fileSize / 1024).toFixed(2)} KB
                    </p>

                    <p className="text-xs">
                      Expires:{" "}
                      {new Date(file.expiresAt).toLocaleDateString()}
                    </p>

                    {/* 🔴 expired badge */}
                    {isExpired && (
                      <span className="text-red-500 text-xs font-semibold">
                        Expired
                      </span>
                    )}

                    <div className="mt-1 flex gap-2 items-center">
                      <span className="bg-gray-200 px-2 py-1 text-xs rounded">
                        {file.code}
                      </span>

                      <button
                        onClick={() => copyCode(file.code)}
                        className="text-blue-500 text-xs"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <button
                    disabled={isExpired}
                    onClick={() => downloadFile(file._id)}
                    className={`px-3 py-1 rounded text-white text-sm ${
                      isExpired
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    Download
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileList;