import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";

import Upload from "./components/Upload";
import FileList from "./components/FileList";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./pages/Landing";


// 🔐 Dashboard (ONLY FOR LOGGED-IN USERS)
const Dashboard = ({ refreshKey, refresh, setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">
            ☁️ CloudDrop Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* 🔵 USER INFO */}
        <div className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-lg">
          🔵 Logged in user → Files expire in <b>21 days</b>
        </div>

        {/* Upload */}
        <Upload onUploadSuccess={refresh} />

        {/* Files */}
        <FileList key={refreshKey} />
      </div>
    </div>
  );
};

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔥 Reactive token state
  const [token, setToken] = useState(localStorage.getItem("token"));

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* 🌐 LANDING (Guest + Entry Point) */}
        <Route path="/" element={<Landing />} />

        {/* 🔐 DASHBOARD (Protected) */}
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

        {/* ❌ FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;