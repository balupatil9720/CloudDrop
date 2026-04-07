import Upload from "./components/Upload";
import FileList from "./components/FileList";

function App() {
  const refresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CloudDrop</h1>
      <Upload onUploadSuccess={refresh} />
      <FileList />
    </div>
  );
}

export default App;