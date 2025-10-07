import { useState, useEffect } from "react";
import {
  Sparkles,
  Send,
  Eye,
  Code as CodeIcon,
  Download,
  Save,
  Home,
  Zap,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBuilderStore } from "../store/useBuilderStore";
import { useAuthStore } from "../store/useAuthStore";
import CodeEditor from "../components/CodeEditor";
import Preview from "../components/Preview";
import ChatMessage from "../components/ChatMessage";
import SaveProjectModal from "../components/SaveProjectModal";

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

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const handleSend = async () => {
    if (!prompt.trim() || isGenerating) return;

    await generateCode(prompt);
    setPrompt("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

  const quickPrompts = [
    "Create a modern landing page for a SaaS startup",
    "Build a portfolio website with dark theme",
    "Generate a dashboard with stats cards",
    "Make a blog homepage with article cards",
  ];

  const getCreditsColor = () => {
    if (user?.plan === "enterprise") return "bg-yellow-50 border-yellow-200";
    if (credits === null) return "bg-gray-50 border-gray-200";
    if (credits === 0) return "bg-red-50 border-red-200";
    if (credits <= 5) return "bg-orange-50 border-orange-200";
    return "bg-purple-50 border-purple-200";
  };

  const getCreditsTextColor = () => {
    if (user?.plan === "enterprise") return "text-yellow-900";
    if (credits === null) return "text-gray-900";
    if (credits === 0) return "text-red-900";
    if (credits <= 5) return "text-orange-900";
    return "text-purple-900";
  };

  const getCreditsLinkColor = () => {
    if (user?.plan === "enterprise") return "text-yellow-600";
    if (credits === 0) return "text-red-600";
    if (credits <= 5) return "text-orange-600";
    return "text-purple-600";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Chat */}
      <aside className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={28} />
              <h1 className="text-2xl font-bold">AI Builder</h1>
            </div>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              <Home size={20} />
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Describe your website and let AI build it
          </p>

          {/* Credits Badge - Enhanced */}
          {credits !== null && (
            <div
              className={`mt-4 border rounded-lg p-4 transition-all ${getCreditsColor()}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {user?.plan === "enterprise" ? (
                    <Zap className={getCreditsTextColor()} size={20} />
                  ) : (
                    <CreditCard className={getCreditsTextColor()} size={20} />
                  )}
                  <span className={`font-bold ${getCreditsTextColor()}`}>
                    {user?.plan === "enterprise"
                      ? "Unlimited Credits"
                      : `${credits} ${credits === 1 ? "Credit" : "Credits"}`}
                  </span>
                </div>
                {user?.plan !== "enterprise" && credits <= 5 && (
                  <span className="text-xs font-semibold px-2 py-1 bg-white rounded">
                    {credits === 0 ? "OUT!" : "LOW"}
                  </span>
                )}
              </div>

              {user?.plan === "enterprise" ? (
                <p className="text-xs text-yellow-700 mb-2">
                  Generate as many websites as you want with your Enterprise
                  plan
                </p>
              ) : credits === 0 ? (
                <p className="text-xs text-red-700 mb-2">
                  You've run out of credits. Upgrade or buy a credit pack to
                  continue.
                </p>
              ) : credits <= 5 ? (
                <p className="text-xs text-orange-700 mb-2">
                  You're running low on credits. Consider upgrading your plan.
                </p>
              ) : (
                <p className="text-xs text-purple-700 mb-2">
                  {user?.plan === "free"
                    ? "Upgrade for more credits per month"
                    : "Credits reset monthly with your subscription"}
                </p>
              )}

              {user?.plan !== "enterprise" && (
                <Link
                  to="/pricing"
                  className={`text-xs font-semibold hover:underline flex items-center gap-1 ${getCreditsLinkColor()}`}
                >
                  {credits === 0 ? (
                    <>
                      <Zap size={14} />
                      Get More Credits
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      {user?.plan === "free" ? "Upgrade Plan" : "Buy Credits"}
                    </>
                  )}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="mx-auto mb-4 text-gray-300" size={48} />
              <p className="text-gray-400 mb-6">
                Start by describing your website
              </p>
              <div className="space-y-2 text-left">
                {quickPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(p)}
                    className="w-full text-sm p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((msg, i) => <ChatMessage key={i} message={msg} />)
          )}

          {isGenerating && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
              <span className="text-sm">Generating your website...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your website..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={
                isGenerating || (credits === 0 && user?.plan !== "enterprise")
              }
            />
            <button
              onClick={handleSend}
              disabled={
                isGenerating ||
                !prompt.trim() ||
                (credits === 0 && user?.plan !== "enterprise")
              }
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                credits === 0 && user?.plan !== "enterprise"
                  ? "No credits remaining"
                  : ""
              }
            >
              <Send size={20} />
            </button>
          </div>
          {credits === 0 && user?.plan !== "enterprise" && (
            <p className="text-xs text-red-600 mt-2">
              Out of credits.{" "}
              <Link to="/pricing" className="underline font-semibold">
                Get more
              </Link>{" "}
              to continue generating.
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                activeTab === "preview"
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Eye size={18} />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                activeTab === "code"
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <CodeIcon size={18} />
              Code
            </button>
          </div>

          <div className="flex gap-2">
            {generatedCode.html && (
              <>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Project
                </button>
                <button
                  onClick={downloadHTML}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Download size={18} />
                  Download
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!generatedCode.html ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Sparkles size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">Your website will appear here</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "preview" && <Preview code={generatedCode} />}
              {activeTab === "code" && <CodeEditor code={generatedCode} />}
            </>
          )}
        </div>
      </main>

      {/* Save Project Modal */}
      {showSaveModal && (
        <SaveProjectModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
};

export default BuilderPage;
