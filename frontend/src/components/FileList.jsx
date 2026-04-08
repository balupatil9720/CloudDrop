import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [codeInput, setCodeInput] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/files`);
      setFiles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadFile = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/download/${id}`);
      window.open(res.data.data.url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  const downloadByCode = async () => {
    if (!codeInput) return alert("Enter code");

    try {
      const res = await axios.get(`${API_BASE}/code/${codeInput}`);
      window.open(res.data.data.url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Invalid or expired code");
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
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
          />

          <button
            onClick={downloadByCode}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Get File
          </button>
        </div>
      </div>

      {/* 📂 FILE LIST */}
      <div className="p-5 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Uploaded Files
        </h2>

        {files.length === 0 ? (
          <p className="text-gray-500 text-sm">No files uploaded yet</p>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => (
              <li
                key={file._id}
                className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-gray-800 font-medium">
                    {file.fileName}
                  </span>

                  <span className="text-xs text-gray-500">
                    {(file.fileSize / 1024).toFixed(2)} KB
                  </span>

                  {/* 🔢 CODE DISPLAY */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      Code: {file.code}
                    </span>

                    <button
                      onClick={() => copyCode(file.code)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* 🔘 ACTIONS */}
                <div className="mt-3 md:mt-0 flex gap-2">
                  <button
                    onClick={() => downloadFile(file._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                  >
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileList;