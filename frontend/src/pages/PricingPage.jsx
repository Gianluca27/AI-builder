import { Link } from "react-router-dom";
import { Sparkles, Check, Zap } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const PricingPage = () => {
  const { isAuthenticated } = useAuthStore();

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out AI Builder",
      features: [
        "10 AI generations",
        "5 saved projects",
        "Basic templates",
        "HTML/CSS/JS export",
        "Community support",
        "Powered by GPT-4",
      ],
      cta: "Get Started",
      ctaLink: "/register",
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Best for professionals and agencies",
      features: [
        "Unlimited AI generations",
        "Unlimited projects",
        "All premium templates",
        "Priority support",
        "Advanced customization",
        "Export to React/Vue",
        "Custom domains",
        "Team collaboration",
      ],
      cta: "Upgrade to Pro",
      ctaLink: "/register",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For large teams and organizations",
      features: [
        "Everything in Pro",
        "API access",
        "White-label options",
        "Dedicated support",
        "Custom integrations",
        "SSO & advanced security",
        "SLA guarantee",
        "Custom training",
      ],
      cta: "Contact Sales",
      ctaLink: "/register",
      popular: false,
    },
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
            <Link to="/templates" className="text-gray-600 hover:text-gray-900">
              Templates
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl opacity-90">
            Choose the perfect plan for your needs. Always know what you'll pay.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 relative ${
                plan.popular
                  ? "ring-2 ring-purple-600 shadow-2xl scale-105"
                  : "shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Zap size={14} />
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold">{plan.price}</span>
                </div>
                <p className="text-gray-500 text-sm">{plan.period}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className="text-green-500 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={plan.ctaLink}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">
              Can I upgrade or downgrade my plan?
            </h3>
            <p className="text-gray-600">
              Yes! You can change your plan at any time. Changes take effect
              immediately and we'll prorate any charges.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600">
              We accept all major credit cards, PayPal, and bank transfers for
              Enterprise plans.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">
              Is there a free trial for Pro?
            </h3>
            <p className="text-gray-600">
              Yes! We offer a 7-day free trial for the Pro plan. No credit card
              required.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">
              What happens to my projects if I cancel?
            </h3>
            <p className="text-gray-600">
              Your projects remain accessible. You can export them at any time,
              but new AI generations will be limited to the Free plan allowance.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers building with AI
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition"
          >
            Start Building for Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
