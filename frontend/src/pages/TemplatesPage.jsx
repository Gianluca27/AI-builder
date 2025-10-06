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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="text-purple-600" size={28} />
            <span>AI Builder</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="/docs" className="text-gray-600 hover:text-gray-900">
              Docs
            </Link>
            {isAuthenticated ? (
              <Link
                to="/builder"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Open Builder
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Template Gallery</h1>
          <p className="text-xl opacity-90">
            Choose a professional template and customize it with AI
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-3 rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat.value
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No templates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <div
                key={template._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Preview Image */}
                <div className="h-64 bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="relative z-10">
                    {categoryIcons[template.category] || <Sparkles size={48} />}
                  </div>
                  {template.isPremium && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      PREMIUM
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                      {template.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye size={14} />
                      <span>{template.usageCount || 0}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Tags */}
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleUseTemplate(template._id)}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Don't see what you need?</h2>
          <p className="text-xl mb-8 opacity-90">
            Use AI to generate a custom website from scratch
          </p>
          <Link
            to={isAuthenticated ? "/builder" : "/register"}
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            Create Custom Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
