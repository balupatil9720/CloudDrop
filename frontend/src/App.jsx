import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Upload from "./components/Upload";
import FileList from "./components/FileList";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const token = localStorage.getItem("token");

  // 🔐 Protected Layout
  const Dashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">
            ☁️ CloudDrop
          </h1>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Upload */}
        <Upload onUploadSuccess={refresh} />

        {/* Files */}
        <FileList key={refreshKey} />
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* Protected Route */}
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" /> : <Login />}
         />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;