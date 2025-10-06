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
    <div className="h-full flex flex-col bg-gray-900">
      {/* Language Tabs */}
      <div className="flex gap-2 p-3 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => setActiveLanguage("html")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeLanguage === "html"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          HTML
        </button>
        <button
          onClick={() => setActiveLanguage("css")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeLanguage === "css"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          CSS
        </button>
        <button
          onClick={() => setActiveLanguage("javascript")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeLanguage === "javascript"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
