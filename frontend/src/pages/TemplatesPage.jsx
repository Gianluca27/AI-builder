import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Eye,
  Rocket,
  Briefcase,
  BarChart,
  FileText,
  ShoppingBag,
  Terminal,
  Menu,
  X,
} from "lucide-react";
import { templatesAPI } from "../services/api";
import { useBuilderStore } from "../store/useBuilderStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const TemplatesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { loadTemplate } = useBuilderStore();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categoryIcons = {
    landing: <Rocket size={32} />,
    portfolio: <Briefcase size={32} />,
    dashboard: <BarChart size={32} />,
    blog: <FileText size={32} />,
    ecommerce: <ShoppingBag size={32} />,
  };

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory]);

  const fetchTemplates = async () => {
    try {
      const params =
        selectedCategory !== "all" ? { category: selectedCategory } : {};
      const response = await templatesAPI.getAll(params);
      setTemplates(response.data);
    } catch (error) {
      console.error("Failed to fetch templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseTemplate = async (templateId) => {
    if (!isAuthenticated) {
      toast.error("Please login to use templates");
      navigate("/login");
      return;
    }

    const result = await loadTemplate(templateId);
    if (result.success) {
      navigate("/builder");
    }
  };

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "landing", label: "Landing Pages" },
    { value: "portfolio", label: "Portfolios" },
    { value: "dashboard", label: "Dashboards" },
    { value: "blog", label: "Blogs" },
    { value: "ecommerce", label: "E-commerce" },
  ];

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
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded font-bold hover:from-cyan-400 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400"
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-center relative z-10">
        <div className="bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 border-2 border-cyan-400/50 rounded-lg p-12 backdrop-blur-sm">
          <div className="inline-block mb-6 px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400 font-mono text-sm animate-pulse-slow">
            $ ls templates/
          </div>
          <h1 className="text-5xl md:text-6xl font-bold font-mono mb-4">
            <span className="text-cyan-400">&gt;</span>
            <span className="text-white"> Template </span>
            <span className="text-emerald-400">Gallery</span>
          </h1>
          <p className="text-xl text-emerald-400 font-mono">
            // Choose a professional template and customize it with AI
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-mono">
            <span className="text-cyan-400">$</span>
            <span className="text-white"> cat categories.json</span>
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-3 rounded font-mono font-bold whitespace-nowrap transition-all border-2 ${
                selectedCategory === cat.value
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400 shadow-lg shadow-cyan-400/50"
                  : "bg-slate-900/50 backdrop-blur-sm text-emerald-400 border-cyan-400/30 hover:border-cyan-400 hover:text-cyan-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-emerald-400 font-mono mt-4">$ loading templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-emerald-400 font-mono text-lg">// No templates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, i) => (
              <div
                key={template._id}
                className="group bg-slate-900/50 backdrop-blur-sm border-2 border-cyan-400/30 rounded overflow-hidden hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 transform hover:-translate-y-2"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${i * 0.1}s backwards`,
                }}
              >
                {/* Preview Image */}
                <div className="h-64 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 flex items-center justify-center relative overflow-hidden border-b-2 border-cyan-400/30">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="relative z-10 text-cyan-400 group-hover:text-cyan-300 transition-colors group-hover:scale-110 duration-300">
                    {categoryIcons[template.category] || <Sparkles size={48} />}
                  </div>
                  {template.isPremium && (
                    <div className="absolute top-4 right-4 bg-cyan-400 text-black px-3 py-1 rounded text-xs font-bold font-mono border-2 border-cyan-400">
                      PREMIUM
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wide">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono">
                      <Eye size={14} />
                      <span>{template.usageCount || 0}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-mono text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-emerald-400 font-mono text-sm mb-4 line-clamp-2">
                    // {template.description}
                  </p>

                  {/* Tags */}
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 px-2 py-1 rounded font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleUseTemplate(template._id)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded font-bold font-mono hover:from-cyan-400 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400"
                  >
                    $ use template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 border-2 border-cyan-400/50 rounded-lg p-12 backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-white mb-6">
            <span className="text-cyan-400">&gt;</span> Don't see what you need?
          </h2>
          <p className="text-xl text-emerald-400 font-mono mb-8">
            // Use AI to generate a custom website from scratch
          </p>
          <Link
            to={isAuthenticated ? "/builder" : "/register"}
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white px-12 py-4 rounded font-bold font-mono text-lg hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400 transition-all inline-flex items-center gap-3 hover:shadow-2xl hover:shadow-cyan-400/50 border-2 border-cyan-400"
          >
            <Terminal size={24} />
            $ create custom
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-cyan-400/30 text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Terminal
              size={24}
              className="text-cyan-400 animate-pulse-slow"
            />
            <span className="text-xl font-bold font-mono bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
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

export default TemplatesPage;
