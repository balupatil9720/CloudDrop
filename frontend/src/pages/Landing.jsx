import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Landing = () => {
  const navigate = useNavigate();

  const [accessCode, setAccessCode] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [activeTab, setActiveTab] = useState("guest");

  const handleFileDownload = async () => {
    if (!accessCode.trim()) {
      alert("Please enter a valid access code");
      return;
    }

    try {
      const response = await api.get(`/files/code/${accessCode}`);
      window.open(response.data.data.url, "_blank");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid or expired access code");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);
      const response = await api.post("/files/upload", formData);
      const fileData = response.data.data;

      setGeneratedCode(fileData.code);
      setIsModalOpen(true);
      setSelectedFile(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">CloudDrop</h1>
                <p className="text-xs text-gray-500 -mt-0.5">Secure File Transfer</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 animate-pulse"></span>
              SECURE FILE TRANSFER
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Instant File Sharing, Simplified.</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Upload once. Share anywhere. Access with a simple code.
            </p>
          </div>
        </div>
      </section>

      {/* User Type Toggle */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6">
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-1 inline-flex">
            <button
              onClick={() => setActiveTab("guest")}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                activeTab === "guest"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Quick Access
            </button>
            <button
              onClick={() => setActiveTab("authenticated")}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                activeTab === "authenticated"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Premium Account
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Guest User Section */}
        {activeTab === "guest" && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Guest Access</h2>
              <p className="text-gray-600">Quick file sharing without registration</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              
              {/* Guest Download Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Retrieve File</h3>
                        <p className="text-xs text-gray-500">Access using 6-digit code</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Free</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Code
                      </label>
                      <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value.toUpperCase().slice(0, 6))}
                        placeholder="••••••"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-center text-2xl tracking-widest"
                        maxLength={6}
                      />
                      <p className="text-xs text-gray-400 mt-2">6-digit alphanumeric code</p>
                    </div>

                    <button
                      onClick={handleFileDownload}
                      className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Download File
                    </button>
                  </div>
                </div>
              </div>

              {/* Guest Upload Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Share File</h3>
                        <p className="text-xs text-gray-500">Get instant access code</p>
                      </div>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">2 Days Expiry</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer bg-gray-50">
                        <input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="hidden"
                          id="guest-file-upload"
                        />
                        <label htmlFor="guest-file-upload" className="cursor-pointer block">
                          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-600">
                            {selectedFile ? selectedFile.name : "Click to browse"}
                          </p>
                          {selectedFile && (
                            <p className="text-xs text-gray-400 mt-2">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          )}
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleFileUpload}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50"
                    >
                      {isLoading ? "Processing..." : "Generate Access Code"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Banner */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v6a1 1 0 102 0V9zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0v-4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-semibold text-gray-900">Upgrade for More Features</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Create a free account to get 21-day file retention, personal dashboard, and file management capabilities.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
                >
                  Create Account →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated User Section */}
        {activeTab === "authenticated" && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Premium Features</h2>
              <p className="text-gray-600">Enhanced security and extended capabilities</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              
              {/* Feature 1 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Extended Retention</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-2">21 Days</p>
                <p className="text-sm text-gray-500">File availability period</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Dashboard</h3>
                <p className="text-sm text-gray-500 mt-2">Manage all your files in one place</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Authentication</h3>
                <p className="text-sm text-gray-500 mt-2">JWT-based protected access</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Sign In to Dashboard
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Create Premium Account
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                ✓ Track file downloads • ✓ Manage multiple files • ✓ Extended storage
              </p>
            </div>
          </div>
        )}

      </main>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">File Upload Successful</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <p className="text-gray-600 text-center mb-4">
                  Your file has been uploaded successfully. Share this access code:
                </p>
                
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Access Code</p>
                  <p className="font-mono text-3xl font-bold text-gray-900 tracking-wider">
                    {generatedCode}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {activeTab === "guest" ? "Valid for 2 days" : "Valid for 21 days"}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>

              {activeTab === "guest" && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-700 text-center">
                    💡 Create an account to extend file retention to 21 days
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Landing;