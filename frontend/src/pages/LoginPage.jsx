import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal, Mail, Lock } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      navigate("/builder");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden flex items-center justify-center p-6">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scanline"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center justify-center gap-3 text-cyan-400 text-3xl font-mono font-bold mb-8 group"
        >
          <Terminal size={36} className="animate-pulse-slow" />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all">
            {"<AI_Builder />"}
          </span>
        </Link>

        {/* Card */}
        <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/50 rounded-lg p-8 shadow-2xl shadow-cyan-400/20">
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-mono text-white mb-2">
              <span className="text-cyan-400">$</span> user.login()
            </h1>
            <p className="text-emerald-400 font-mono text-sm">
              // Access your AI workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium font-mono text-emerald-400 mb-2">
                --email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border-2 border-cyan-400/30 rounded font-mono text-white placeholder-emerald-400/50 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="user@domain.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium font-mono text-emerald-400 mb-2">
                --password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400"
                  size={20}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border-2 border-cyan-400/30 rounded font-mono text-white placeholder-emerald-400/50 focus:outline-none focus:border-cyan-400 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded font-bold font-mono hover:from-cyan-400 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "$ authenticating..." : "$ npm run login"}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-emerald-400 font-mono text-sm">
            // No account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 font-semibold hover:text-purple-400 hover:underline"
            >
              ./register
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <Link
          to="/"
          className="block text-center text-emerald-400 font-mono mt-6 hover:text-cyan-400 transition-colors"
        >
          {"<- cd ../home"}
        </Link>
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

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
