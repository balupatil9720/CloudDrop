import { useState } from "react";
import api from "../utils/api";

const Upload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const response = await api.post("/files/upload", formData);
      const fileData = response.data.data;

      setGeneratedCode(fileData.code);
      setIsModalOpen(true);
      setFile(null);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      alert(error.response?.data?.message || "File upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Upload New File</h3>
              <p className="text-xs text-gray-500">Share files securely with access codes</p>
            </div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Select File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-gray-50">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-xs text-gray-600">
                  {file ? file.name : "Click to browse or drag and drop"}
                </p>
                {file && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                      }}
                      className="text-xs text-red-500 hover:text-red-600 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Max size: 2GB
                </p>
              </label>
            </div>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleFileUpload}
            disabled={isLoading || !file}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium text-sm hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Upload & Generate Code"
            )}
          </button>

          {/* Info Note */}
          <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
            <div className="flex items-start space-x-2">
              <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-700">
                Encrypted storage • Valid for 21 days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smaller Success Modal with Visible Access Code */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full shadow-2xl">
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Upload Successful</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <p className="text-gray-600 text-center text-sm mb-3">
                  Share this access code with the recipient:
                </p>
                
                {/* Clearly Visible Access Code Field */}
                <div className="bg-gray-100 rounded-lg p-3 text-center border-2 border-indigo-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Access Code</p>
                  <div className="flex items-center justify-center space-x-2">
                    <p className="font-mono text-2xl font-bold text-indigo-700 tracking-wider bg-white px-4 py-2 rounded-lg shadow-inner">
                      {generatedCode}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Valid for 21 days
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-700 text-center">
                  ⚠️ Save this code - required for file access
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Upload;