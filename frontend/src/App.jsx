import { useState } from "react";
import Upload from "./components/Upload";
import FileList from "./components/FileList";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CloudDrop</h1>
      <Upload onUploadSuccess={refresh} />
      <FileList key={refreshKey} />
    </div>
  );
}

export default App;