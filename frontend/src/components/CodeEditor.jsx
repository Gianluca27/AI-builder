import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useBuilderStore } from "../store/useBuilderStore";

const CodeEditor = ({ code }) => {
  const [activeLanguage, setActiveLanguage] = useState("html");
  const { updateCode } = useBuilderStore();

  const getCode = () => {
    switch (activeLanguage) {
      case "html":
        return code.html;
      case "css":
        return code.css;
      case "javascript":
        return code.js;
      default:
        return "";
    }
  };

  const handleEditorChange = (value) => {
    updateCode(activeLanguage, value || "");
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Language Tabs */}
      <div className="flex gap-2 p-3 bg-black/90 border-b border-yellow-400/30 backdrop-blur-sm">
        <button
          onClick={() => setActiveLanguage("html")}
          className={`px-4 py-2 rounded font-mono text-sm font-bold transition ${
            activeLanguage === "html"
              ? "bg-yellow-400 text-black"
              : "bg-black/50 border border-yellow-400/30 text-green-400 hover:border-yellow-400 hover:text-yellow-400"
          }`}
        >
          HTML
        </button>
        <button
          onClick={() => setActiveLanguage("css")}
          className={`px-4 py-2 rounded font-mono text-sm font-bold transition ${
            activeLanguage === "css"
              ? "bg-yellow-400 text-black"
              : "bg-black/50 border border-yellow-400/30 text-green-400 hover:border-yellow-400 hover:text-yellow-400"
          }`}
        >
          CSS
        </button>
        <button
          onClick={() => setActiveLanguage("javascript")}
          className={`px-4 py-2 rounded font-mono text-sm font-bold transition ${
            activeLanguage === "javascript"
              ? "bg-yellow-400 text-black"
              : "bg-black/50 border border-yellow-400/30 text-green-400 hover:border-yellow-400 hover:text-yellow-400"
          }`}
        >
          JavaScript
        </button>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={activeLanguage}
          value={getCode()}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            fontFamily: "'Fira Code', 'Courier New', monospace",
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
