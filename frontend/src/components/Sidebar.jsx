import { useEffect, useState } from "react";
import api from "../utils/api";

const Sidebar = ({ onLogout }) => {
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setProfile(res.data.data);
    } catch (err) {
      console.log("Profile fetch failed");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">

      <div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>

          <h3 className="mt-3 font-semibold">
            {profile?.name || "User"}
      </h3>

           <p className="text-xs text-gray-500">
               {profile?.email || "user@email.com"}
           </p>
        </div>

        {profile && (
          <div className="space-y-2 text-sm mb-6">
            <p>📂 Files: <b>{profile.totalFiles}</b></p>
            <p>💾 Storage: <b>{(profile.totalStorage / (1024 * 1024)).toFixed(2)} MB</b></p>
            <p>📥 Downloads: <b>{profile.totalDownloads}</b></p>
            <p className="text-green-600">Active: {profile.activeFiles}</p>
            <p className="text-red-500">Expired: {profile.expiredFiles}</p>
          </div>
        )}

        
      </div>

      <button onClick={onLogout} className="text-red-500 text-sm">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;