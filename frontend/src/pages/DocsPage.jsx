import { Link } from "react-router-dom";
import { Terminal, Book, Zap, Code, Download, Lightbulb, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const DocsPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scanline"></div>

      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-cyan-400/30 sticky top-0 z-50 shadow-lg shadow-cyan-400/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-3 text-cyan-400 text-2xl font-mono font-bold group"
          >
            <Terminal size={32} className="animate-pulse-slow" />
            <span className="group-hover:text-cyan-300 transition-colors">
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
              className="hover:text-cyan-400 transition-colors hover:underline"
            >
              ./pricing
            </Link>
            <Link
              to="/docs"
              className="hover:text-cyan-400 transition-colors hover:underline"
            >
              ./docs
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-cyan-400 transition-colors hover:underline"
                >
                  ./dashboard
                </Link>
                <Link
                  to="/builder"
                  className="bg-cyan-400 text-black px-6 py-2 rounded font-bold hover:bg-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400"
                >
                  $ run builder
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-cyan-400 transition-colors hover:underline"
                >
                  ./login
                </Link>
                <Link
                  to="/register"
                  className="bg-cyan-400 text-black px-6 py-2 rounded font-bold hover:bg-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400"
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
              className="block py-2 hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ./pricing
            </Link>
            <Link
              to="/docs"
              className="block py-2 hover:text-cyan-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ./docs
            </Link>
            {isAuthenticated ? (
              <Link
                to="/builder"
                className="block py-2 hover:text-cyan-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                $ run builder
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-cyan-400 transition-colors"
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

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="inline-block mb-6 px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400 font-mono text-sm animate-pulse-slow">
          $ cat documentation.md
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 font-mono">
          <span className="text-cyan-400">&gt;_</span>
          <span className="text-white"> Documentation</span>
        </h1>

        <p className="text-xl text-emerald-400 font-mono mb-8">
          // Everything you need to know about building websites with AI
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 relative z-10">
        {/* Quick Start */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-cyan-400" size={32} />
            <h2 className="text-3xl font-bold font-mono text-white">
              <span className="text-cyan-400">$</span> quick_start.sh
            </h2>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-8 shadow-2xl shadow-cyan-400/20 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-3">
                <span className="text-emerald-400">→</span> 1. Create an Account
              </h3>
              <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                // Sign up for a free account to get started. You'll receive 10
                free AI generations to try out the platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-3">
                <span className="text-emerald-400">→</span> 2. Describe Your Website
              </h3>
              <p className="text-emerald-400 font-mono text-sm mb-3 leading-relaxed">
                // Open the Builder and describe what you want to create. Be
                specific for best results:
              </p>
              <div className="bg-black/50 p-4 rounded border border-cyan-400/20">
                <p className="text-sm font-mono text-emerald-400">
                  "Create a modern landing page for a SaaS startup with a
                  gradient hero section, feature cards, and a pricing table"
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-3">
                <span className="text-emerald-400">→</span> 3. Generate & Customize
              </h3>
              <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                // Wait 5-10 seconds for GPT-4 to generate your website. Then
                customize the code in the editor or ask AI to make improvements.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-3">
                <span className="text-emerald-400">→</span> 4. Download & Deploy
              </h3>
              <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                // Export your website as HTML and deploy it anywhere - Netlify,
                Vercel, GitHub Pages, or your own hosting.
              </p>
            </div>
          </div>
        </section>

        {/* Writing Good Prompts */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="text-cyan-400" size={32} />
            <h2 className="text-3xl font-bold font-mono text-white">
              <span className="text-cyan-400">$</span> writing_prompts.md
            </h2>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-8 shadow-2xl shadow-cyan-400/20 space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3 font-mono text-emerald-400">
                ✓ Good Examples
              </h3>
              <ul className="space-y-2 text-emerald-400 font-mono text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  <span>
                    "Modern portfolio website with dark theme, project grid, and
                    smooth animations"
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  <span>
                    "Dashboard with sidebar navigation, stats cards showing
                    metrics, and data tables"
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">→</span>
                  <span>
                    "Landing page for a fitness app with hero CTA, benefits
                    section, testimonials"
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3 font-mono text-red-400">
                ✗ Avoid
              </h3>
              <ul className="space-y-2 text-red-400 font-mono text-sm">
                <li className="flex items-start gap-2">
                  <span>→</span>
                  <span>"Make me a website" // too vague</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>→</span>
                  <span>"Something cool" // not specific</span>
                </li>
              </ul>
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/30 p-4 rounded">
              <p className="text-sm text-cyan-400 font-mono">
                <strong>// Tip:</strong> Include details about layout, colors,
                sections, and functionality for best results.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="text-cyan-400" size={32} />
            <h2 className="text-3xl font-bold font-mono text-white">
              <span className="text-cyan-400">$</span> cat features.json
            </h2>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-8 shadow-2xl shadow-cyan-400/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold font-mono text-cyan-400 mb-2">
                  <span className="text-emerald-400">→</span> AI Code Generation
                </h3>
                <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                  // Powered by GPT-4 to generate production-ready HTML, CSS, and
                  JavaScript
                </p>
              </div>

              <div>
                <h3 className="font-bold font-mono text-cyan-400 mb-2">
                  <span className="text-emerald-400">→</span> Live Preview
                </h3>
                <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                  // See your website in real-time as you generate and edit
                </p>
              </div>

              <div>
                <h3 className="font-bold font-mono text-cyan-400 mb-2">
                  <span className="text-emerald-400">→</span> Code Editor
                </h3>
                <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                  // Monaco editor with syntax highlighting and IntelliSense
                </p>
              </div>

              <div>
                <h3 className="font-bold font-mono text-cyan-400 mb-2">
                  <span className="text-emerald-400">→</span> Project Management
                </h3>
                <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                  // Save, organize, and manage all your projects in one place
                </p>
              </div>

              <div>
                <h3 className="font-bold font-mono text-cyan-400 mb-2">
                  <span className="text-emerald-400">→</span> Templates
                </h3>
                <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                  // Start from professional templates and customize with AI
                </p>
              </div>

              <div>
                <h3 className="font-bold font-mono text-cyan-400 mb-2">
                  <span className="text-emerald-400">→</span> Export Options
                </h3>
                <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                  // Download HTML or export to popular frameworks
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Export & Deploy */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Download className="text-cyan-400" size={32} />
            <h2 className="text-3xl font-bold font-mono text-white">
              <span className="text-cyan-400">$</span> deployment.sh
            </h2>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-8 shadow-2xl shadow-cyan-400/20 space-y-6">
            <div>
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-3">
                <span className="text-emerald-400">→</span> Download HTML
              </h3>
              <p className="text-emerald-400 font-mono text-sm mb-3 leading-relaxed">
                // Click the "Download" button to get a complete HTML file with
                embedded CSS and JavaScript. This file works standalone.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-3">
                <span className="text-emerald-400">→</span> Deploy to Netlify
              </h3>
              <div className="space-y-2 text-emerald-400 font-mono text-sm">
                <div><span className="text-cyan-400">1.</span> Download your HTML file</div>
                <div><span className="text-cyan-400">2.</span> Go to netlify.com/drop</div>
                <div><span className="text-cyan-400">3.</span> Drag and drop your file</div>
                <div><span className="text-cyan-400">4.</span> Get your live URL instantly!</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-3">
                <span className="text-emerald-400">→</span> Deploy to Vercel
              </h3>
              <div className="space-y-2 text-emerald-400 font-mono text-sm">
                <div><span className="text-cyan-400">1.</span> Create a GitHub repository</div>
                <div><span className="text-cyan-400">2.</span> Push your HTML file</div>
                <div><span className="text-cyan-400">3.</span> Import to Vercel</div>
                <div><span className="text-cyan-400">4.</span> Deploy with one click</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-mono text-cyan-400 mb-3">
                <span className="text-emerald-400">→</span> GitHub Pages
              </h3>
              <p className="text-emerald-400 font-mono text-sm leading-relaxed">
                // Perfect for free hosting. Just push to a GitHub repo and enable
                Pages in settings.
              </p>
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-3xl font-bold font-mono text-white mb-6">
            <span className="text-cyan-400">$</span> help --support
          </h2>
          <div className="bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 border-2 border-cyan-400/50 rounded-lg p-8 backdrop-blur-sm text-center">
            <p className="text-xl text-emerald-400 font-mono mb-6">
              // Can't find what you're looking for?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/builder" : "/register"}
                className="bg-cyan-400 text-black px-8 py-3 rounded font-bold font-mono hover:bg-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400"
              >
                $ try --now
              </Link>
              <a
                href="mailto:support@aibuilder.com"
                className="bg-black/50 backdrop-blur-md text-cyan-400 border-2 border-cyan-400/50 px-8 py-3 rounded font-bold font-mono hover:bg-cyan-400/10 hover:border-cyan-400 transition-all"
              >
                ./contact_support
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-cyan-400/30 text-white py-12 relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Terminal
              size={24}
              className="text-cyan-400 animate-pulse-slow"
            />
            <span className="text-xl font-bold font-mono text-cyan-400">
              {"<AI_Builder />"}
            </span>
          </div>
          <p className="text-emerald-400 font-mono text-sm">
            © 2025 AI Builder • Built with GPT-4 and React
          </p>
          <p className="text-cyan-400/50 font-mono text-xs mt-2">
            // Powered by artificial intelligence
          </p>
        </div>
      </footer>

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

export default DocsPage;
