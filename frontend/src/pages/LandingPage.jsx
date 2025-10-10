import { Link } from "react-router-dom";
import {
  Sparkles,
  Zap,
  Code,
  Eye,
  Layout,
  Download,
  Menu,
  X,
  Terminal,
  Cpu,
  Blocks,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const [tetrisBlocks, setTetrisBlocks] = useState([]);

  useEffect(() => {
    // Generate tetris-like code blocks
    const blocks = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      shape: ["L", "T", "I", "O", "S"][Math.floor(Math.random() * 5)],
      color: [
        "text-cyan-400/10",
        "text-purple-400/10",
        "text-pink-400/10",
        "text-blue-400/10",
      ][Math.floor(Math.random() * 4)],
    }));
    setTetrisBlocks(blocks);
  }, []);

  const features = [
    {
      icon: <Terminal className="w-8 h-8" />,
      title: "AI Generation",
      description: "Generate complete websites using GPT-4 in seconds",
      color: "cyan",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Clean Code",
      description: "Production-ready HTML, CSS, and JavaScript",
      color: "purple",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Live Preview",
      description: "See your website in real-time as you generate",
      color: "pink",
    },
    {
      icon: <Blocks className="w-8 h-8" />,
      title: "10+ Templates",
      description: "Professional templates for any use case",
      color: "blue",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Easy Export",
      description: "Download and deploy immediately",
      color: "emerald",
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Smart AI",
      description: "Understands your requirements perfectly",
      color: "violet",
    },
  ];

  const codeSnippets = [
    '<div className="app">',
    "const build = async () => {",
    "function generate() {",
    'import React from "react"',
    "export default App;",
    "/* AI Generated */",
    "npm run build",
    'git commit -m "AI"',
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      cyan: {
        border: "border-cyan-400/30 hover:border-cyan-400",
        text: "text-cyan-400",
        shadow: "hover:shadow-cyan-400/30",
        iconHover: "group-hover:text-cyan-300",
      },
      purple: {
        border: "border-purple-400/30 hover:border-purple-400",
        text: "text-purple-400",
        shadow: "hover:shadow-purple-400/30",
        iconHover: "group-hover:text-purple-300",
      },
      pink: {
        border: "border-pink-400/30 hover:border-pink-400",
        text: "text-pink-400",
        shadow: "hover:shadow-pink-400/30",
        iconHover: "group-hover:text-pink-300",
      },
      blue: {
        border: "border-blue-400/30 hover:border-blue-400",
        text: "text-blue-400",
        shadow: "hover:shadow-blue-400/30",
        iconHover: "group-hover:text-blue-300",
      },
      emerald: {
        border: "border-emerald-400/30 hover:border-emerald-400",
        text: "text-emerald-400",
        shadow: "hover:shadow-emerald-400/30",
        iconHover: "group-hover:text-emerald-300",
      },
      violet: {
        border: "border-violet-400/30 hover:border-violet-400",
        text: "text-violet-400",
        shadow: "hover:shadow-violet-400/30",
        iconHover: "group-hover:text-violet-300",
      },
    };
    return colorMap[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Animated Code Tetris Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {tetrisBlocks.map((block) => (
          <div
            key={block.id}
            className={`absolute ${block.color} font-mono text-xs whitespace-nowrap animate-tetris-fall`}
            style={{
              left: `${block.left}%`,
              animationDelay: `${block.delay}s`,
              animationDuration: `${block.duration}s`,
            }}
          >
            {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
          </div>
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Scanline effect with gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scanline"></div>

      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-cyan-400/30 sticky top-0 z-50 shadow-lg shadow-cyan-400/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-3 text-cyan-400 text-2xl font-mono font-bold group"
          >
            <Terminal size={32} className="animate-pulse-slow" />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all">
              {"<AI_Builder />"}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-emerald-400 items-center font-mono">
            <Link
              to="/templates"
              className="hover:text-cyan-400 transition-colors hover:underline"
            >
              ./templates
            </Link>
            <Link
              to="/pricing"
              className="hover:text-purple-400 transition-colors hover:underline"
            >
              ./pricing
            </Link>
            <Link
              to="/docs"
              className="hover:text-pink-400 transition-colors hover:underline"
            >
              ./docs
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-400 transition-colors hover:underline"
                >
                  ./dashboard
                </Link>
                <Link
                  to="/builder"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded font-bold hover:from-cyan-400 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400"
                >
                  $ run builder
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-violet-400 transition-colors hover:underline"
                >
                  ./login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded font-bold hover:from-cyan-400 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400"
                >
                  $ init
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-cyan-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/90 backdrop-blur-sm border-t border-cyan-400/30 p-4 text-emerald-400 font-mono">
            <Link
              to="/templates"
              className="block py-2 hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ./templates
            </Link>
            <Link
              to="/pricing"
              className="block py-2 hover:text-purple-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ./pricing
            </Link>
            <Link
              to="/docs"
              className="block py-2 hover:text-pink-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ./docs
            </Link>
            {isAuthenticated ? (
              <Link
                to="/builder"
                className="block py-2 hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                $ run builder
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-violet-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ./login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-cyan-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  $ init
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 border border-cyan-400/30 rounded text-cyan-400 font-mono text-sm animate-pulse-slow">
          $ system.status: ONLINE
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 font-mono">
          <span className="text-cyan-400 animate-glitch">&gt;_</span>
          <span className="text-white"> Build </span>
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Websites
          </span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>

        <div className="font-mono text-emerald-400 text-lg md:text-xl mb-12 space-y-2">
          <p className="animate-typing">
            <span className="text-cyan-400">$</span> Generate professional code
            in seconds
          </p>
          <p className="animate-typing" style={{ animationDelay: "0.5s" }}>
            <span className="text-purple-400">$</span> Powered by GPT-4 • HTML •
            CSS • JavaScript
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={isAuthenticated ? "/builder" : "/register"}
            className="group bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-12 py-4 rounded font-bold font-mono text-lg hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 transition-all transform hover:scale-105 inline-flex items-center justify-center gap-3 border-2 border-cyan-400 hover:shadow-2xl hover:shadow-cyan-400/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            <Terminal size={24} className="relative z-10" />
            <span className="relative z-10">$ npm start</span>
          </Link>
          <Link
            to="/templates"
            className="bg-slate-900/50 backdrop-blur-sm text-purple-400 border-2 border-purple-400/50 px-12 py-4 rounded font-bold font-mono text-lg hover:bg-purple-400/10 hover:border-purple-400 transition-all hover:text-pink-400"
          >
            ./view_templates
          </Link>
        </div>
      </div>

      {/* Terminal Window Feature Showcase */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-mono mb-4">
            <span className="text-cyan-400">$</span>
            <span className="text-white"> cat features.json</span>
          </h2>
          <div className="text-emerald-400 font-mono">
            <span className="text-purple-400">&#123;</span>{" "}
            <span className="text-cyan-400">"powerful"</span>:{" "}
            <span className="text-pink-400">true</span>{" "}
            <span className="text-purple-400">&#125;</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const colors = getColorClasses(feature.color);
            return (
              <div
                key={i}
                className={`group bg-slate-900/50 backdrop-blur-sm border-2 ${colors.border} p-8 rounded ${colors.shadow} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2`}
                style={{
                  animation: `fadeInUp 0.6s ease-out ${i * 0.1}s backwards`,
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`${colors.text} ${colors.iconHover} transition-colors group-hover:animate-bounce`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold font-mono text-white mb-2 ${colors.text} transition-colors`}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 font-mono text-sm leading-relaxed">
                      <span className={colors.text}>//</span>{" "}
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div
                  className={`${colors.text} opacity-30 font-mono text-xs mt-4 group-hover:opacity-50 transition-opacity`}
                >
                  [MODULE_LOADED]
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Building Animation Section */}
      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">
        <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/50 rounded-lg overflow-hidden shadow-2xl shadow-cyan-400/20">
          <div className="bg-gradient-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 border-b border-cyan-400/30 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 font-mono text-sm text-cyan-400">
              terminal.sh
            </span>
          </div>
          <div className="p-6 font-mono text-sm space-y-2">
            <div className="text-emerald-400 animate-typing">
              <span className="text-cyan-400">$</span> ai-builder generate
              website
            </div>
            <div
              className="text-purple-400 animate-typing"
              style={{ animationDelay: "1s" }}
            >
              → Analyzing requirements...
            </div>
            <div
              className="text-blue-400 animate-typing"
              style={{ animationDelay: "2s" }}
            >
              → Generating HTML structure...
            </div>
            <div
              className="text-cyan-400 animate-typing"
              style={{ animationDelay: "3s" }}
            >
              → Styling with CSS...
            </div>
            <div
              className="text-emerald-400 animate-typing"
              style={{ animationDelay: "4s" }}
            >
              → Adding JavaScript functionality...
            </div>
            <div
              className="text-pink-400 font-bold animate-typing"
              style={{ animationDelay: "5s" }}
            >
              ✓ Website generated successfully!
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 border-2 border-cyan-400/50 rounded-lg p-12 backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-white mb-6">
            <span className="text-cyan-400">&gt;</span> Ready to deploy?
          </h2>
          <p className="text-xl text-emerald-400 font-mono mb-8">
            <span className="text-purple-400">//</span> Join thousands of
            developers building faster with AI
          </p>
          <Link
            to={isAuthenticated ? "/builder" : "/register"}
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-12 py-4 rounded font-bold font-mono text-lg hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 transition-all inline-flex items-center gap-3 hover:shadow-2xl hover:shadow-cyan-400/50 border-2 border-cyan-400"
          >
            <Terminal size={24} />$ git init --free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-cyan-400/30 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Terminal size={24} className="text-cyan-400 animate-pulse-slow" />
            <span className="text-xl font-bold font-mono bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {"<AI_Builder />"}
            </span>
          </div>
          <p className="text-emerald-400 font-mono text-sm">
            © 2025 AI Builder • Built with GPT-4 and React
          </p>
          <p className="text-cyan-400/50 font-mono text-xs mt-2">
            <span className="text-purple-400">//</span> Powered by artificial
            intelligence
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes tetris-fall {
          from {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        @keyframes glitch {
          0%,
          100% {
            transform: translate(0);
          }
          25% {
            transform: translate(-2px, 2px);
          }
          50% {
            transform: translate(2px, -2px);
          }
          75% {
            transform: translate(-2px, -2px);
          }
        }

        @keyframes typing {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-tetris-fall {
          animation: tetris-fall linear infinite;
        }

        .animate-scanline {
          animation: scanline 8s linear infinite;
        }

        .animate-glitch {
          animation: glitch 1s infinite;
        }

        .animate-typing {
          animation: typing 0.5s ease-out forwards;
          opacity: 0;
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

export default LandingPage;
