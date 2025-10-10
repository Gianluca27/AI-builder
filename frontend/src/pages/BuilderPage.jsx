import { useState, useEffect, useRef } from "react";
import {
  Send,
  Eye,
  Code as CodeIcon,
  Download,
  Save,
  Home,
  Zap,
  CreditCard,
  Terminal,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Mic,
  MicOff,
  Settings,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBuilderStore } from "../store/useBuilderStore";
import { useAuthStore } from "../store/useAuthStore";
import CodeEditor from "../components/CodeEditor";
import Preview from "../components/Preview";
import ChatMessage from "../components/ChatMessage";
import SaveProjectModal from "../components/SaveProjectModal";
import GithubModal from "../components/GithubModal";
import toast from "react-hot-toast";

const BuilderPage = () => {
  const {
    generatedCode,
    chatHistory,
    isGenerating,
    activeTab,
    credits,
    generateCode,
    setActiveTab,
    fetchCredits,
  } = useBuilderStore();

  const { user } = useAuthStore();

  const [prompt, setPrompt] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const handleSend = async () => {
    if (!prompt.trim() || isGenerating) return;

    await generateCode(prompt);
    setPrompt("");
    setShowQuickPrompts(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // File upload handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded`);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Audio recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await convertSpeechToText(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started...");
    } catch (error) {
      toast.error("Microphone access denied");
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Recording stopped. Converting to text...");
    }
  };

  const convertSpeechToText = async (audioBlob) => {
    try {
      const { aiAPI } = await import("../services/api");
      const response = await aiAPI.transcribe(audioBlob, "es"); // Puedes hacer el idioma dinámico

      if (response.success) {
        const transcribedText = response.data.text;
        setPrompt((prev) => (prev ? prev + " " + transcribedText : transcribedText));
        toast.success("Audio converted to text!");
      }
    } catch (error) {
      toast.error("Failed to convert audio to text");
      console.error("Speech-to-text error:", error);
    }
  };

  const downloadHTML = () => {
    const fullCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    ${generatedCode.css ? `<style>${generatedCode.css}</style>` : ""}
</head>
<body>
${generatedCode.html}
${generatedCode.js ? `<script>${generatedCode.js}</script>` : ""}
</body>
</html>`;

    const blob = new Blob([fullCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Load repository code from GitHub
  const handleLoadRepo = (repoData) => {
    const { updateCode } = useBuilderStore.getState();

    // Load the code into the editor
    updateCode("html", repoData.htmlCode || "");
    updateCode("css", repoData.cssCode || "");
    updateCode("js", repoData.jsCode || "");

    toast.success(`Repository "${repoData.repoName}" loaded! You can now improve it with AI.`);
  };

  const quickPrompts = [
    {
      title: "Landing Page",
      prompt: "Create a modern landing page for a SaaS startup with hero section, features, pricing table, and testimonials",
    },
    {
      title: "Portfolio",
      prompt: "Build a portfolio website with dark theme, project grid with hover effects, about section, and contact form",
    },
    {
      title: "Dashboard",
      prompt: "Generate a dashboard with sidebar navigation, stats cards showing metrics, data tables, and charts",
    },
    {
      title: "Blog",
      prompt: "Make a blog homepage with featured article, article cards grid, categories sidebar, and newsletter signup",
    },
    {
      title: "E-commerce",
      prompt: "Create an e-commerce product page with image gallery, product details, add to cart button, and reviews section",
    },
    {
      title: "Login Page",
      prompt: "Build a modern login page with email and password inputs, remember me checkbox, forgot password link, and social login buttons",
    },
  ];

  const getCreditsStatus = () => {
    if (user?.plan === "enterprise") return { color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30", icon: <Zap size={16} />, text: "∞ Unlimited" };
    if (credits === 0) return { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30", icon: <CreditCard size={16} />, text: "0 Credits" };
    if (credits <= 5) return { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30", icon: <CreditCard size={16} />, text: `${credits} Credits` };
    return { color: "text-emerald-400", bg: "bg-green-400/10", border: "border-emerald-400/30", icon: <CreditCard size={16} />, text: `${credits} Credits` };
  };

  const creditsStatus = getCreditsStatus();

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Top Bar */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-cyan-400/30 px-6 py-3 flex items-center justify-between z-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="text-cyan-400 animate-pulse" size={24} />
            <h1 className="text-xl font-bold font-mono text-cyan-400">{"<AI_Builder />"}</h1>
          </div>

          {/* Credits Badge - Compact */}
          {credits !== null && (
            <div className={`flex items-center gap-2 px-3 py-1.5 ${creditsStatus.bg} border ${creditsStatus.border} rounded-full`}>
              <span className={creditsStatus.color}>{creditsStatus.icon}</span>
              <span className={`text-xs font-bold font-mono ${creditsStatus.color}`}>
                {creditsStatus.text}
              </span>
              {user?.plan !== "enterprise" && credits <= 5 && (
                <Link
                  to="/pricing"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline ml-1"
                >
                  Get more
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 rounded font-mono text-sm transition ${
                activeTab === "preview"
                  ? "bg-cyan-400 text-black font-bold"
                  : "text-emerald-400 hover:text-cyan-400"
              }`}
            >
              <Eye className="inline mr-1" size={16} />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 rounded font-mono text-sm transition ${
                activeTab === "code"
                  ? "bg-cyan-400 text-black font-bold"
                  : "text-emerald-400 hover:text-cyan-400"
              }`}
            >
              <CodeIcon className="inline mr-1" size={16} />
              Code
            </button>
          </div>

          {/* Action Buttons */}
          {generatedCode.html && (
            <div className="flex gap-2 ml-4 border-l border-cyan-400/30 pl-4">
              <button
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-2 bg-cyan-400 text-black rounded font-mono font-bold hover:bg-cyan-300 transition text-sm"
              >
                <Save className="inline mr-1" size={16} />
                Save
              </button>
              <button
                onClick={downloadHTML}
                className="px-4 py-2 bg-green-500 text-black rounded font-mono font-bold hover:bg-green-400 transition text-sm"
              >
                <Download className="inline mr-1" size={16} />
                Download
              </button>
            </div>
          )}

          <Link
            to="/dashboard"
            className="ml-4 text-cyan-400 hover:text-cyan-300 transition-colors"
            title="Back to Dashboard"
          >
            <Home size={20} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas */}
        <main className="flex-1 overflow-hidden bg-black relative">
          {!generatedCode.html ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-2xl px-6">
                <Terminal size={80} className="mx-auto mb-6 opacity-20 text-cyan-400" />
                <h2 className="text-2xl font-mono text-white mb-3">
                  <span className="text-cyan-400">$</span> Ready to build
                </h2>
                <p className="text-emerald-400 font-mono text-sm mb-8">
                  // Describe your website below and AI will generate it for you
                </p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "preview" && <Preview code={generatedCode} />}
              {activeTab === "code" && <CodeEditor code={generatedCode} />}
            </>
          )}
        </main>

        {/* Sidebar - Chat History (Collapsible) */}
        {chatHistory.length > 0 && (
          <aside
            className={`bg-black/90 backdrop-blur-sm border-l border-cyan-400/30 transition-all duration-300 ${
              showChatHistory ? "w-80" : "w-12"
            } flex-shrink-0 flex flex-col`}
          >
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="p-3 border-b border-cyan-400/30 text-cyan-400 hover:text-cyan-300 flex items-center justify-center"
            >
              {showChatHistory ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>

            {showChatHistory && (
              <>
                <div className="p-4 border-b border-cyan-400/30">
                  <h3 className="font-mono text-sm text-emerald-400">// Chat History</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.map((msg, i) => (
                    <ChatMessage key={i} message={msg} />
                  ))}
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Input Bar - Expanded */}
      <div className="bg-black/90 backdrop-blur-sm border-t-2 border-cyan-400/30 p-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          {/* Quick Prompts */}
          {showQuickPrompts && chatHistory.length === 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-mono text-emerald-400">// Quick Start Templates</h3>
                <button
                  onClick={() => setShowQuickPrompts(false)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
                >
                  Hide
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {quickPrompts.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(item.prompt);
                      setShowQuickPrompts(false);
                    }}
                    className="p-3 bg-black/50 border border-cyan-400/30 rounded hover:border-cyan-400 transition text-left group"
                  >
                    <Sparkles size={14} className="text-cyan-400 mb-1" />
                    <div className="text-xs font-mono text-emerald-400 group-hover:text-cyan-400 transition">
                      {item.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main Input */}
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              {/* Uploaded Files Display */}
              {uploadedFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded text-xs font-mono text-cyan-400"
                    >
                      <Paperclip size={12} />
                      <span>{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="hover:text-red-400 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Textarea and Controls Row */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="$ Describe your website in detail... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full px-5 py-4 pb-12 bg-black/50 border-2 border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white font-mono text-sm placeholder:text-emerald-400/50 transition-colors resize-none"
                  disabled={isGenerating || (credits === 0 && user?.plan !== "enterprise")}
                  rows={3}
                  style={{ lineHeight: "1.6" }}
                />

                {/* Bottom Controls Inside Textarea */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* File Upload Button */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.txt,.doc,.docx"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-black/50 border border-cyan-400/30 rounded hover:border-cyan-400 hover:bg-cyan-400/10 transition text-emerald-400 hover:text-cyan-400"
                      title="Upload files"
                      disabled={isGenerating}
                    >
                      <Paperclip size={16} />
                    </button>

                    {/* Voice Recording Button */}
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`p-2 border rounded transition ${
                        isRecording
                          ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse"
                          : "bg-black/50 border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-400/10 text-emerald-400 hover:text-cyan-400"
                      }`}
                      title={isRecording ? "Stop recording" : "Start recording"}
                      disabled={isGenerating}
                    >
                      {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>

                    {/* Model Selector Button */}
                    <div className="relative">
                      <button
                        onClick={() => setShowModelSelector(!showModelSelector)}
                        className="p-2 bg-black/50 border border-cyan-400/30 rounded hover:border-cyan-400 hover:bg-cyan-400/10 transition text-emerald-400 hover:text-cyan-400"
                        title="Select AI Model"
                        disabled={isGenerating}
                      >
                        <Settings size={16} />
                      </button>

                      {/* Model Selector Dropdown */}
                      {showModelSelector && (
                        <div className="absolute bottom-full left-0 mb-2 bg-black border-2 border-cyan-400/50 rounded-lg shadow-2xl shadow-cyan-400/20 p-2 min-w-[200px]">
                          <div className="text-xs font-mono text-emerald-400 mb-2 px-2">
                            // Select AI Model
                          </div>
                          {["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"].map((model) => (
                            <button
                              key={model}
                              onClick={() => {
                                setSelectedModel(model);
                                setShowModelSelector(false);
                                toast.success(`Model changed to ${model}`);
                              }}
                              className={`w-full text-left px-3 py-2 rounded font-mono text-sm transition ${
                                selectedModel === model
                                  ? "bg-cyan-400 text-black font-bold"
                                  : "text-emerald-400 hover:bg-cyan-400/10 hover:text-cyan-400"
                              }`}
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* GitHub Button */}
                    <button
                      onClick={() => setShowGithubModal(true)}
                      className="p-2 bg-black/50 border border-cyan-400/30 rounded hover:border-cyan-400 hover:bg-cyan-400/10 transition text-emerald-400 hover:text-cyan-400"
                      title="GitHub Integration - Load or Push repos"
                      disabled={isGenerating}
                    >
                      <Github size={16} />
                    </button>
                  </div>

                  {/* Model indicator */}
                  <div className="text-xs font-mono text-emerald-400/50">
                    {selectedModel}
                  </div>
                </div>
              </div>

              {credits === 0 && user?.plan !== "enterprise" && (
                <p className="text-xs text-red-400 font-mono mt-2">
                  // ERROR: Out of credits.{" "}
                  <Link
                    to="/pricing"
                    className="underline font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    Get more
                  </Link>
                </p>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={
                isGenerating ||
                !prompt.trim() ||
                (credits === 0 && user?.plan !== "enterprise")
              }
              className="px-8 py-4 bg-cyan-400 text-black rounded-lg hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold font-mono flex items-center gap-2 text-sm"
              title={
                credits === 0 && user?.plan !== "enterprise"
                  ? "No credits remaining"
                  : "Generate website"
              }
            >
              {isGenerating ? (
                <>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                    <div
                      className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Save Project Modal */}
      {showSaveModal && (
        <SaveProjectModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {/* GitHub Integration Modal */}
      {showGithubModal && (
        <GithubModal
          isOpen={showGithubModal}
          onClose={() => setShowGithubModal(false)}
          projectCode={generatedCode}
          onLoadRepo={handleLoadRepo}
        />
      )}
    </div>
  );
};

export default BuilderPage;
