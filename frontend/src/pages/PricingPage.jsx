import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Check, Zap, CreditCard } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { billingAPI } from "../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

const PricingPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const plans = [
    {
      id: "free",
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
      disabled: false,
    },
    {
      id: "basic",
      name: "Basic",
      price: "$9",
      period: "per month",
      planId: import.meta.env.VITE_PAYPAL_BASIC_PLAN_ID,
      description: "Great for freelancers and small projects",
      features: [
        "100 AI generations/month",
        "Unlimited projects",
        "All templates",
        "Priority support",
        "Advanced customization",
        "Export to React/Vue",
      ],
      cta: "Subscribe to Basic",
      popular: false,
      disabled: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      period: "per month",
      planId: import.meta.env.VITE_PAYPAL_PRO_PLAN_ID,
      description: "Best for professionals and agencies",
      features: [
        "300 AI generations/month",
        "Unlimited projects",
        "All premium templates",
        "Priority support",
        "Advanced customization",
        "Export to React/Vue",
        "Custom domains",
        "Team collaboration",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      disabled: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "per month",
      planId: import.meta.env.VITE_PAYPAL_ENTERPRISE_PLAN_ID,
      description: "For large teams and organizations",
      features: [
        "Unlimited AI generations",
        "Unlimited projects",
        "All enterprise features",
        "Dedicated support",
        "Custom integrations",
        "SSO & advanced security",
        "SLA guarantee",
        "Custom training",
      ],
      cta: "Go Enterprise",
      popular: false,
      disabled: false,
    },
  ];

  const creditPacks = [
    {
      id: "pack_50",
      name: "50 Credits",
      price: "$5",
      credits: 50,
      description: "Perfect for occasional use",
    },
    {
      id: "pack_100",
      name: "100 Credits",
      price: "$9",
      credits: 100,
      description: "Best value for money",
      popular: true,
    },
    {
      id: "pack_500",
      name: "500 Credits",
      price: "$40",
      credits: 500,
      description: "For power users",
    },
  ];

  const handleSubscription = async (planId) => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    setLoadingPlan(planId);
    try {
      const response = await billingAPI.createSubscription(planId);
      // Redirigir a PayPal para aprobar la suscripción
      window.location.href = response.approvalUrl;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error creating subscription"
      );
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCreditPack = async (packId) => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    try {
      const response = await billingAPI.createOrder(packId);
      // Redirigir a PayPal para completar el pago
      window.location.href = response.approvalUrl;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating order");
    }
  };

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
        <div className="grid md:grid-cols-4 gap-8">
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

              {user?.plan === plan.id && (
                <div className="absolute -top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  CURRENT PLAN
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

              {plan.id === "free" ? (
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
              ) : (
                <button
                  onClick={() => handleSubscription(plan.planId)}
                  disabled={
                    loadingPlan === plan.planId ||
                    user?.plan === plan.id ||
                    !isAuthenticated
                  }
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    user?.plan === plan.id
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } ${loadingPlan === plan.planId ? "opacity-50" : ""}`}
                >
                  {loadingPlan === plan.planId ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : user?.plan === plan.id ? (
                    "Current Plan"
                  ) : !isAuthenticated ? (
                    "Sign Up to Subscribe"
                  ) : (
                    plan.cta
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Credit Packs Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-r from-purple-50 to-blue-50 -mx-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Need Extra Credits?</h2>
          <p className="text-gray-600 text-lg">
            Purchase credit packs to supplement your plan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`bg-white rounded-xl p-8 shadow-lg ${
                pack.popular ? "ring-2 ring-purple-600 relative" : ""
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                  BEST VALUE
                </div>
              )}

              <div className="text-center mb-6">
                <CreditCard
                  className="mx-auto mb-4 text-purple-600"
                  size={48}
                />
                <h3 className="text-2xl font-bold mb-2">{pack.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{pack.description}</p>
                <div className="text-4xl font-bold text-purple-600">
                  {pack.price}
                </div>
              </div>

              <button
                onClick={() => handleCreditPack(pack.id)}
                disabled={!isAuthenticated}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {!isAuthenticated ? "Sign Up to Purchase" : "Buy Now"}
              </button>
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
              Yes! You can change your plan at any time from your dashboard.
              Changes take effect immediately.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600">
              We accept all major credit cards through PayPal. You don't need a
              PayPal account to pay.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">
              Do unused credits roll over?
            </h3>
            <p className="text-gray-600">
              Subscription credits reset monthly. Credit packs never expire and
              can be used anytime.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2">
              What happens if I cancel?
            </h3>
            <p className="text-gray-600">
              Your subscription will remain active until the end of the billing
              period. You can still use all features until then.
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
