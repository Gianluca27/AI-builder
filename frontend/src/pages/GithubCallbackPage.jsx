import { useEffect } from "react";
import { Terminal } from "lucide-react";

const GithubCallbackPage = () => {
  useEffect(() => {
    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const token = params.get("token");
    const username = params.get("username");
    const error = params.get("error");

    if (success === "true" && token) {
      // Store token in localStorage
      localStorage.setItem("github_token", token);
      if (username) {
        localStorage.setItem("github_username", username);
      }

      // Send message to opener window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "GITHUB_AUTH_SUCCESS",
            token,
            username,
          },
          window.location.origin
        );
      }

      // Close popup after a short delay
      setTimeout(() => {
        window.close();
      }, 1000);
    } else if (error) {
      // Send error message to opener
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "GITHUB_AUTH_ERROR",
            error,
          },
          window.location.origin
        );
      }

      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scanline"></div>

      <div className="text-center relative z-10">
        <Terminal size={64} className="mx-auto mb-4 text-cyan-400 animate-pulse" />
        <h1 className="text-2xl font-bold font-mono text-cyan-400 mb-2">
          $ connecting github...
        </h1>
        <p className="text-emerald-400 font-mono text-sm">
          // This window will close automatically
        </p>
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GithubCallbackPage;
