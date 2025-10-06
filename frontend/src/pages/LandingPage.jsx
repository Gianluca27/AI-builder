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
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Generation",
      description: "Generate complete websites using GPT-4 in seconds",
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Clean Code",
      description: "Production-ready HTML, CSS, and JavaScript",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Live Preview",
      description: "See your website in real-time as you generate",
    },
    {
      icon: <Layout className="w-8 h-8" />,
      title: "10+ Templates",
      description: "Professional templates for any use case",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "Easy Export",
      description: "Download and deploy immediately",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Smart AI",
      description: "Understands your requirements perfectly",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-white text-2xl font-bold"
          >
            <Sparkles size={32} />
            <span>AI Builder</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-white items-center">
            <Link to="/templates" className="hover:text-purple-200 transition">
              Templates
            </Link>
            <Link to="/pricing" className="hover:text-purple-200 transition">
              Pricing
            </Link>
            <Link to="/docs" className="hover:text-purple-200 transition">
              Docs
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-purple-200 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/builder"
                  className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition"
                >
                  Open Builder
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-purple-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-50 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-md p-4 text-white">
            <Link
              to="/templates"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/docs"
              className="block py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            {isAuthenticated ? (
              <Link
                to="/builder"
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Open Builder
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-white">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in">
          Build Websites with AI
        </h1>
        <p className="text-xl md:text-2xl mb-12 opacity-90">
          Generate professional HTML, CSS, and JavaScript in seconds using GPT-4
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to={isAuthenticated ? "/builder" : "/register"}
            className="bg-white text-purple-600 px-12 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition transform hover:scale-105 inline-flex items-center gap-2"
          >
            <Sparkles size={24} />
            Start Building Free
          </Link>
          <Link
            to="/templates"
            className="bg-white/10 backdrop-blur-md text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition"
          >
            View Templates
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-md p-8 rounded-2xl hover:bg-white/20 transition animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-purple-200 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-purple-100">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to build your website?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Join thousands of developers using AI to build faster
        </p>
        <Link
          to={isAuthenticated ? "/builder" : "/register"}
          className="bg-white text-purple-600 px-12 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition inline-block"
        >
          Get Started - It's Free
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={24} />
            <span className="text-xl font-bold">AI Builder</span>
          </div>
          <p className="text-white/70">
            © 2025 AI Builder. Built with GPT-4 and React.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
