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
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      {/* Header - Compact */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">CloudDrop</h1>
            <p className="text-[10px] text-gray-500 -mt-0.5">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Profile Section - Compact */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-lg font-semibold text-indigo-600">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {profile?.name || "User"}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {profile?.email || "user@email.com"}
            </p>
          </div>
        </div>

        {/* Stats - Compact Grid */}
        {profile && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[10px] text-gray-600">Files</span>
                </div>
                <p className="text-sm font-bold text-blue-600">{profile.totalFiles}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <span className="text-[10px] text-gray-600">Storage</span>
                </div>
                <p className="text-sm font-bold text-purple-600">
                  {(profile.totalStorage / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="text-[10px] text-gray-600">Downloads</span>
                </div>
                <p className="text-sm font-bold text-green-600">{profile.totalDownloads}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-2">
                <div className="flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] text-gray-600">Active</span>
                </div>
                <p className="text-sm font-bold text-green-600">{profile.activeFiles}</p>
              </div>
            </div>

            {/* Expired Row */}
            <div className="bg-red-50 rounded-lg p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-[10px] text-gray-600">Expired Files</span>
                </div>
                <span className="text-sm font-bold text-red-600">{profile.expiredFiles}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Compact */}
      <div className="mt-10 p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;