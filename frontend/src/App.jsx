import { useState } from "react";
import Upload from "./components/Upload";
import FileList from "./components/FileList";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-6 space-y-6">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-600">
          ☁️ CloudDrop
        </h1>

        {/* Upload Section */}
        <Upload onUploadSuccess={refresh} />

        {/* File List */}
        <FileList key={refreshKey} />

      </div>
    </div>
  );
}

export default App;