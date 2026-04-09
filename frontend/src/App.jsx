import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

import Upload from "./components/Upload";
import FileList from "./components/FileList";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";

// 🔐 Dashboard Component
const Dashboard = ({ refreshKey, refresh, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null); // 🔥 update state
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">
            ☁️ CloudDrop
          </h1>

          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Upload + Files */}
        <Upload onUploadSuccess={refresh} />
        <FileList key={refreshKey} />
      </div>
    </div>
  );
};

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔥 Reactive token
  const [token, setToken] = useState(localStorage.getItem("token"));

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard */}
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

        {/* Login */}
        <Route
          path="/login"
          element={<Login setToken={setToken} />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup setToken={setToken} />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;