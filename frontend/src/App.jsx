import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

import { Toaster } from "react-hot-toast";

import Upload from "./components/Upload";
import FileList from "./components/FileList";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

// 🔐 Dashboard
const Dashboard = ({ refreshKey, refresh, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* 🔵 SIDEBAR (Fixed) */}
      <div className="w-64 h-screen sticky top-0">
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* 🔷 MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            ☁️ CloudDrop Dashboard
          </h1>
        </div>

        {/* INFO CARD */}
        <div className="bg-blue-50 text-blue-700 text-sm px-4 py-3 rounded-lg mb-6">
          🔵 Logged in user → Files expire in <b>21 days</b>
        </div>

        {/* CONTENT STACK */}
        <div className="space-y-6">

          {/* Upload */}
          <Upload onUploadSuccess={refresh} />

          {/* Files */}
          <FileList key={refreshKey} />

        </div>

      </div>
    </div>
  );
};

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <BrowserRouter>

      {/* 🔥 GLOBAL TOASTER */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
            borderRadius: "10px",
            padding: "11px 20px",
          },
          success: {
            style: {
              background: "#ecfdf5",
              color: "#065f46",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#7f1d1d",
            },
          },
        }}
      />

      <Routes>

        {/* 🌐 LANDING */}
        <Route path="/" element={<Landing />} />

        {/* 🔐 DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard
                refreshKey={refreshKey}
                refresh={refresh}
                setToken={setToken}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🔐 LOGIN */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setToken={setToken} />
            )
          }
        />

        {/* 🔐 SIGNUP */}
        <Route
          path="/signup"
          element={
            token ? (
              <Navigate to="/dashboard" />
            ) : (
              <Signup setToken={setToken} />
            )
          }
        />

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;