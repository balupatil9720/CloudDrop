import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const FileList = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_BASE}/files`);
      setFiles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
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
              className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col">
                <span className="text-gray-800 font-medium">
                  {file.fileName}
                </span>
                <span className="text-xs text-gray-500">
                  {(file.fileSize / 1024).toFixed(2)} KB
                </span>
              </div>

              <span className="text-xs text-blue-500 font-medium">
                Stored
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileList;