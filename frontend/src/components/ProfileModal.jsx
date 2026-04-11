import { useEffect, useState } from "react";
import api from "../utils/api";

const ProfileModal = ({ onClose }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await api.get("/profile");
      setData(res.data.data);
    };
    fetch();
  }, []);

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg w-80">
        <h2 className="text-lg font-semibold mb-3">Profile</h2>

        <p>Files: {data.totalFiles}</p>
        <p>Storage: {(data.totalStorage / (1024 * 1024)).toFixed(2)} MB</p>
        <p>Downloads: {data.totalDownloads}</p>

        <button onClick={onClose} className="mt-3 bg-indigo-600 text-white px-3 py-1 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;