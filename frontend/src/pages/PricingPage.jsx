import { Link, useNavigate } from "react-router-dom";
import { Check, Zap, CreditCard, Terminal, Menu, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { billingAPI } from "../services/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const PricingPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tetrisBlocks, setTetrisBlocks] = useState([]);

  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    // Generate tetris-like code blocks
    const blocks = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
    }));
    setTetrisBlocks(blocks);
  }, []);

  const codeSnippets = [
    "$ subscribe --plan=pro",
    "const pricing = {...}",
    "// Choose your plan",
    "npm install --save",
    "export default Plan;",
    "PayPal.init()",
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Animated Code Tetris Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {tetrisBlocks.map((block) => (
          <div
            key={block.id}
            className="absolute text-cyan-400/10 font-mono text-xs whitespace-nowrap animate-tetris-fall"
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

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scanline"></div>

      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-sm border-b border-cyan-400/30 sticky top-0 z-50 shadow-lg shadow-cyan-400/10">
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
      <div className="bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 border-y-2 border-cyan-400/30 text-white py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400 font-mono text-sm animate-pulse-slow">
            $ cat pricing.json
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-mono">
            <span className="text-cyan-400">&gt;</span>
            <span className="text-white"> Simple, Transparent </span>
            <span className="text-emerald-400">Pricing</span>
          </h1>
          <p className="text-xl text-emerald-400 font-mono">
            // Choose the perfect plan for your needs. Always know what you'll pay.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-slate-900/70 backdrop-blur-sm border-2 rounded-lg p-8 relative transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular
                  ? "border-cyan-400 shadow-2xl shadow-cyan-400/30 scale-105"
                  : "border-cyan-400/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-black px-6 py-1 rounded text-sm font-bold font-mono flex items-center gap-1">
                  <Zap size={14} />
                  MOST POPULAR
                </div>
              )}

              {user?.plan === plan.id && (
                <div className="absolute -top-4 right-4 bg-green-400 text-black px-4 py-1 rounded text-xs font-bold font-mono">
                  CURRENT PLAN
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-cyan-400 font-mono">{plan.name}</h3>
                <p className="text-emerald-400 text-sm mb-4 font-mono">// {plan.description}</p>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white font-mono">{plan.price}</span>
                </div>
                <p className="text-emerald-400/70 text-sm font-mono">{plan.period}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className="text-emerald-400 flex-shrink-0 mt-0.5"
                      size={20}
                    />
                    <span className="text-emerald-400 font-mono text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === "free" ? (
                <Link
                  to={plan.ctaLink}
                  className={`block w-full text-center py-3 rounded font-semibold font-mono transition-all ${
                    plan.popular
                      ? "bg-cyan-400 text-black hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/50"
                      : "bg-black/50 border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400"
                  }`}
                >
                  $ {plan.cta}
                </Link>
              ) : !isAuthenticated ? (
                <Link
                  to="/register"
                  className={`block w-full text-center py-3 rounded font-semibold font-mono transition-all ${
                    plan.popular
                      ? "bg-cyan-400 text-black hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/50"
                      : "bg-black/50 border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400"
                  }`}
                >
                  $ Sign Up to Subscribe
                </Link>
              ) : (
                <button
                  onClick={() => handleSubscription(plan.planId)}
                  disabled={loadingPlan === plan.planId || user?.plan === plan.id}
                  className={`w-full py-3 rounded font-semibold font-mono transition-all ${
                    user?.plan === plan.id
                      ? "bg-green-400/20 text-emerald-400 cursor-not-allowed border-2 border-emerald-400/30"
                      : plan.popular
                      ? "bg-cyan-400 text-black hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/50"
                      : "bg-black/50 border-2 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400"
                  } ${loadingPlan === plan.planId ? "opacity-50" : ""}`}
                >
                  {loadingPlan === plan.planId ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : user?.plan === plan.id ? (
                    "$ Current Plan"
                  ) : (
                    `$ ${plan.cta}`
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Credit Packs Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-r from-cyan-400/10 via-green-400/10 to-cyan-400/10 border-y-2 border-cyan-400/30 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400 font-mono text-sm">
            $ ls credits/
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white font-mono">
            <span className="text-cyan-400">&gt;</span> Need Extra Credits?
          </h2>
          <p className="text-emerald-400 text-lg font-mono">
            // Purchase credit packs to supplement your plan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {creditPacks.map((pack) => (
            <div
              key={pack.id}
              className={`bg-slate-900/70 backdrop-blur-sm border-2 rounded-lg p-8 transition-all duration-300 transform hover:-translate-y-2 relative ${
                pack.popular
                  ? "border-cyan-400 shadow-2xl shadow-cyan-400/30"
                  : "border-cyan-400/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/30"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black px-4 py-1 rounded text-xs font-bold font-mono">
                  BEST VALUE
                </div>
              )}

              <div className="text-center mb-6">
                <CreditCard
                  className="mx-auto mb-4 text-cyan-400"
                  size={48}
                />
                <h3 className="text-2xl font-bold mb-2 text-cyan-400 font-mono">{pack.name}</h3>
                <p className="text-emerald-400 text-sm mb-4 font-mono">// {pack.description}</p>
                <div className="text-4xl font-bold text-white font-mono">
                  {pack.price}
                </div>
              </div>

              {!isAuthenticated ? (
                <Link
                  to="/register"
                  className="block w-full text-center py-3 bg-cyan-400 text-black rounded font-semibold font-mono hover:bg-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-400/50"
                >
                  $ Sign Up to Purchase
                </Link>
              ) : (
                <button
                  onClick={() => handleCreditPack(pack.id)}
                  className="w-full py-3 bg-cyan-400 text-black rounded font-semibold font-mono hover:bg-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-400/50"
                >
                  $ Buy Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400 font-mono text-sm">
            $ cat faq.md
          </div>
          <h2 className="text-3xl font-bold text-white font-mono">
            <span className="text-cyan-400">&gt;</span> Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all">
            <h3 className="text-lg font-bold mb-2 text-cyan-400 font-mono">
              // Can I upgrade or downgrade my plan?
            </h3>
            <p className="text-emerald-400 font-mono text-sm">
              Yes! You can change your plan at any time from your dashboard.
              Changes take effect immediately.
            </p>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all">
            <h3 className="text-lg font-bold mb-2 text-cyan-400 font-mono">
              // What payment methods do you accept?
            </h3>
            <p className="text-emerald-400 font-mono text-sm">
              We accept all major credit cards through PayPal. You don't need a
              PayPal account to pay.
            </p>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all">
            <h3 className="text-lg font-bold mb-2 text-cyan-400 font-mono">
              // Do unused credits roll over?
            </h3>
            <p className="text-emerald-400 font-mono text-sm">
              Subscription credits reset monthly. Credit packs never expire and
              can be used anytime.
            </p>
          </div>

          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all">
            <h3 className="text-lg font-bold mb-2 text-cyan-400 font-mono">
              // What happens if I cancel?
            </h3>
            <p className="text-emerald-400 font-mono text-sm">
              Your subscription will remain active until the end of the billing
              period. You can still use all features until then.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 border-y-2 border-cyan-400/50 text-white py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            <span className="text-cyan-400">&gt;</span> Ready to deploy?
          </h2>
          <p className="text-xl mb-8 text-emerald-400 font-mono">
            // Join thousands of developers building with AI
          </p>
          <Link
            to="/register"
            className="inline-block bg-cyan-400 text-black px-12 py-4 rounded font-bold font-mono text-lg hover:bg-cyan-300 transition-all hover:shadow-2xl hover:shadow-cyan-400/50 border-2 border-cyan-400"
          >
            <Terminal className="inline mr-2" size={20} />
            $ git init --free
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

        .animate-tetris-fall {
          animation: tetris-fall linear infinite;
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

export default PricingPage;
