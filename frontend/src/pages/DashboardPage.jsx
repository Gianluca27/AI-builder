import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Folder,
  Trash2,
  Eye,
  LogOut,
  CreditCard,
  Zap,
  X,
  Terminal,
  Menu,
  Calendar,
  TrendingUp,
  Clock,
  Settings,
} from "lucide-react";
import { projectsAPI, billingAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { useBuilderStore } from "../store/useBuilderStore";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const { loadProject } = useBuilderStore();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usage, setUsage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recent"); // recent, name

  useEffect(() => {
    fetchProjects();
    if (user?.plan !== "free") {
      fetchUsage();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await billingAPI.getUsage();
      setUsage(response.data);
    } catch (error) {
      console.error("Failed to load usage data");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleLoadProject = async (projectId) => {
    await loadProject(projectId);
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      await billingAPI.cancelSubscription();
      toast.success("Subscription canceled successfully");
      setShowCancelModal(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
    } finally {
      setIsCanceling(false);
    }
  };

  const getPlanBadge = (plan) => {
    const badges = {
      free: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30", label: "Free" },
      basic: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", label: "Basic" },
      pro: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", label: "Pro" },
      enterprise: { bg: "bg-yellow-500/20", text: "text-cyan-400", border: "border-yellow-500/30", label: "Enterprise" },
    };
    return badges[plan] || badges.free;
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const planBadge = getPlanBadge(user?.plan);
  const creditsPercentage = user?.plan === "enterprise" ? 100 : user?.plan === "free" ? (user?.credits / 10) * 100 : (user?.credits / (user?.plan === "basic" ? 100 : user?.plan === "pro" ? 300 : 10)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden font-mono">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-scanline"></div>

      {/* Navigation */}
      <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-cyan-400/30 sticky top-0 z-50 shadow-lg shadow-cyan-400/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-3 text-cyan-400 text-2xl font-mono font-bold group"
          >
            <Terminal size={28} className="animate-pulse-slow" />
            <span className="group-hover:text-cyan-300 transition-colors">
              {"<AI_Builder />"}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <div className="flex items-center gap-3 px-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg">
              <div className="text-right">
                <p className="text-white font-bold text-sm">{user?.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className={`px-2 py-0.5 ${planBadge.bg} ${planBadge.text} border ${planBadge.border} rounded text-xs font-bold`}>
                    {planBadge.label}
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/builder"
              className="bg-cyan-400 text-black px-6 py-2.5 rounded font-bold hover:bg-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400 flex items-center gap-2"
            >
              <Plus size={18} />
              New Project
            </Link>

            <button
              onClick={logout}
              className="text-cyan-400 hover:text-cyan-300 transition-colors p-2"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
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
          <div className="md:hidden bg-slate-900/90 backdrop-blur-sm border-t border-cyan-400/30 p-4">
            <div className="mb-4 pb-4 border-b border-cyan-400/30">
              <p className="text-white font-bold">{user?.name}</p>
              <div className={`inline-block px-2 py-1 ${planBadge.bg} ${planBadge.text} border ${planBadge.border} rounded text-xs font-bold mt-2`}>
                {planBadge.label}
              </div>
            </div>
            <Link
              to="/builder"
              className="block py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              $ new project
            </Link>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="block py-2 text-cyan-400 hover:text-cyan-300 transition-colors w-full text-left"
            >
              $ logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Credits Card */}
          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="text-cyan-400" size={20} />
                <h3 className="text-sm text-emerald-400">// Credits</h3>
              </div>
              {user?.plan !== "enterprise" && (
                <Link
                  to="/pricing"
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                >
                  Get more
                </Link>
              )}
            </div>
            <div className="mb-3">
              <p className="text-3xl font-bold text-white mb-1">
                {user?.plan === "enterprise" ? "∞" : user?.credits || 0}
              </p>
              <p className="text-xs text-emerald-400">
                {user?.plan === "enterprise" ? "Unlimited" : "Available credits"}
              </p>
            </div>
            {user?.plan !== "enterprise" && (
              <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    creditsPercentage > 50 ? "bg-green-400" : creditsPercentage > 20 ? "bg-orange-400" : "bg-red-400"
                  }`}
                  style={{ width: `${Math.min(creditsPercentage, 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Projects Card */}
          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="text-cyan-400" size={20} />
              <h3 className="text-sm text-emerald-400">// Projects</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">{projects.length}</p>
              <p className="text-xs text-emerald-400">Total websites created</p>
            </div>
          </div>

          {/* Plan Card */}
          <div className="bg-slate-900/70 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-6 hover:border-cyan-400 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-cyan-400" size={20} />
              <h3 className="text-sm text-emerald-400">// Current Plan</h3>
            </div>
            <div className="mb-3">
              <p className="text-2xl font-bold text-white mb-1 capitalize">{user?.plan}</p>
              <p className="text-xs text-emerald-400">
                {usage?.nextBillingDate ? `Renews ${new Date(usage.nextBillingDate).toLocaleDateString()}` : "Active"}
              </p>
            </div>
            <div className="flex gap-2">
              {user?.plan === "free" ? (
                <Link
                  to="/pricing"
                  className="text-xs bg-cyan-400 text-black px-3 py-1.5 rounded font-bold hover:bg-cyan-300 transition-all"
                >
                  Upgrade
                </Link>
              ) : (
                <>
                  {user?.plan !== "enterprise" && (
                    <Link
                      to="/pricing"
                      className="text-xs bg-cyan-400/20 text-cyan-400 border border-cyan-400/50 px-3 py-1.5 rounded font-bold hover:bg-cyan-400/30 transition-all"
                    >
                      Upgrade
                    </Link>
                  )}
                  {user?.plan !== "free" && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="text-xs bg-red-400/20 text-red-400 border border-red-400/50 px-3 py-1.5 rounded font-bold hover:bg-red-400/30 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-2 border-cyan-400/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                <span className="text-cyan-400">$</span> ls projects/
              </h2>
              <p className="text-sm text-emerald-400">// Your AI-generated websites</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-black/50 border border-cyan-400/30 rounded text-emerald-400 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
              </select>
              <Link
                to="/builder"
                className="bg-cyan-400 text-black px-4 py-2 rounded font-bold hover:bg-cyan-300 transition-all flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                New
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-emerald-400 font-mono mt-4 text-sm">$ loading...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <Terminal className="mx-auto mb-4 text-cyan-400/30" size={64} />
              <h3 className="text-xl font-semibold text-white mb-2">
                <span className="text-cyan-400">&gt;</span> No projects yet
              </h3>
              <p className="text-emerald-400 mb-6 text-sm">
                // Create your first website with AI
              </p>
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 bg-cyan-400 text-black px-6 py-3 rounded font-bold hover:bg-cyan-300 transition-all hover:shadow-lg hover:shadow-cyan-400/50 border-2 border-cyan-400"
              >
                <Plus size={20} />
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedProjects.map((project, i) => (
                <div
                  key={project._id}
                  className="group bg-slate-900/50 backdrop-blur-sm border-2 border-cyan-400/20 rounded-lg p-5 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${i * 0.05}s backwards`,
                  }}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <Clock size={12} />
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  {project.description && (
                    <p className="text-xs text-emerald-400 mb-4 line-clamp-2">
                      // {project.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to="/builder"
                      onClick={() => handleLoadProject(project._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-cyan-400 text-black rounded font-bold hover:bg-cyan-300 transition-all text-sm"
                    >
                      <Eye size={14} />
                      Open
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="px-3 py-2 border-2 border-red-400/30 text-red-400 rounded font-bold hover:bg-red-400/10 hover:border-red-400 transition-all"
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-cyan-400/50 rounded-lg p-8 max-w-md w-full shadow-2xl shadow-cyan-400/20">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  <span className="text-cyan-400">$</span> cancel_subscription
                </h3>
                <p className="text-emerald-400 text-sm">
                  // Are you sure?
                </p>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-cyan-400">
                <strong className="text-yellow-300">Warning:</strong> Your subscription will remain active
                until the end of your current billing period. You'll still have
                access to all features until then.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 border-2 border-cyan-400/30 text-emerald-400 rounded font-bold hover:border-cyan-400/50 transition-all"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded font-bold hover:bg-red-600 transition-all disabled:opacity-50 border-2 border-red-500"
              >
                {isCanceling ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Canceling...
                  </span>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
            transform: translateY(20px);
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

export default DashboardPage;
