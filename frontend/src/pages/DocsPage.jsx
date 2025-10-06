import { Link } from "react-router-dom";
import { Sparkles, Book, Zap, Code, Download, Lightbulb } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const DocsPage = () => {
  const { isAuthenticated } = useAuthStore();

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
            <Link to="/templates" className="text-gray-600 hover:text-gray-900">
              Templates
            </Link>
            <Link to="/pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            {isAuthenticated ? (
              <Link
                to="/builder"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Open Builder
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Book className="mx-auto mb-4" size={48} />
          <h1 className="text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-xl opacity-90">
            Everything you need to know about building websites with AI
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Quick Start */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="text-purple-600" size={32} />
            <h2 className="text-3xl font-bold">Quick Start</h2>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3">1. Create an Account</h3>
              <p className="text-gray-600">
                Sign up for a free account to get started. You'll receive 10
                free AI generations to try out the platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">
                2. Describe Your Website
              </h3>
              <p className="text-gray-600 mb-3">
                Open the Builder and describe what you want to create. Be
                specific for best results:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-mono text-gray-800">
                  "Create a modern landing page for a SaaS startup with a
                  gradient hero section, feature cards, and a pricing table"
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">
                3. Generate & Customize
              </h3>
              <p className="text-gray-600">
                Wait 5-10 seconds for GPT-4 to generate your website. Then
                customize the code in the editor or ask AI to make improvements.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">4. Download & Deploy</h3>
              <p className="text-gray-600">
                Export your website as HTML and deploy it anywhere - Netlify,
                Vercel, GitHub Pages, or your own hosting.
              </p>
            </div>
          </div>
        </section>

        {/* Writing Good Prompts */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="text-purple-600" size={32} />
            <h2 className="text-3xl font-bold">Writing Effective Prompts</h2>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3 text-green-600">
                ✅ Good Examples
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">→</span>
                  <span>
                    "Modern portfolio website with dark theme, project grid, and
                    smooth animations"
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">→</span>
                  <span>
                    "Dashboard with sidebar navigation, stats cards showing
                    metrics, and data tables"
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">→</span>
                  <span>
                    "Landing page for a fitness app with hero CTA, benefits
                    section, testimonials"
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3 text-red-600">❌ Avoid</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">→</span>
                  <span>"Make me a website" (too vague)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">→</span>
                  <span>"Something cool" (not specific)</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>💡 Tip:</strong> Include details about layout, colors,
                sections, and functionality for best results.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="text-purple-600" size={32} />
            <h2 className="text-3xl font-bold">Features</h2>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">AI Code Generation</h3>
                <p className="text-gray-600 text-sm">
                  Powered by GPT-4 to generate production-ready HTML, CSS, and
                  JavaScript
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Live Preview</h3>
                <p className="text-gray-600 text-sm">
                  See your website in real-time as you generate and edit
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Code Editor</h3>
                <p className="text-gray-600 text-sm">
                  Monaco editor with syntax highlighting and IntelliSense
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Project Management</h3>
                <p className="text-gray-600 text-sm">
                  Save, organize, and manage all your projects in one place
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Templates</h3>
                <p className="text-gray-600 text-sm">
                  Start from professional templates and customize with AI
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Export Options</h3>
                <p className="text-gray-600 text-sm">
                  Download HTML or export to popular frameworks
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Export & Deploy */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Download className="text-purple-600" size={32} />
            <h2 className="text-3xl font-bold">Export & Deploy</h2>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3">Download HTML</h3>
              <p className="text-gray-600 mb-3">
                Click the "Download" button to get a complete HTML file with
                embedded CSS and JavaScript. This file works standalone.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Deploy to Netlify</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Download your HTML file</li>
                <li>Go to netlify.com/drop</li>
                <li>Drag and drop your file</li>
                <li>Get your live URL instantly!</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Deploy to Vercel</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Create a GitHub repository</li>
                <li>Push your HTML file</li>
                <li>Import to Vercel</li>
                <li>Deploy with one click</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">GitHub Pages</h3>
              <p className="text-gray-600">
                Perfect for free hosting. Just push to a GitHub repo and enable
                Pages in settings.
              </p>
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Need Help?</h2>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 text-center">
            <p className="text-xl mb-6">Can't find what you're looking for?</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50"
              >
                Try It Now
              </Link>
              <a
                href="mailto:support@aibuilder.com"
                className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-lg font-semibold hover:bg-white/20"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DocsPage;
