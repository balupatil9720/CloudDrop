import { useEffect, useState } from "react";
import axios from "axios";

const FileList = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/files/files"
      );
      setFiles(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file._id}>
            {file.fileName} ({file.fileSize} bytes)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;