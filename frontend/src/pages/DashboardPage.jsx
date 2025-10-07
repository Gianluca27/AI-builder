import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Folder,
  Trash2,
  Eye,
  LogOut,
  CreditCard,
  Zap,
  X,
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
      // Recargar datos del usuario
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
    } finally {
      setIsCanceling(false);
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "basic":
        return "bg-blue-100 text-blue-700";
      case "pro":
        return "bg-purple-100 text-purple-700";
      case "enterprise":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPlanName = (plan) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1);
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
            <div className="text-right mr-4">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">
                {getPlanName(user?.plan)} Plan
              </p>
            </div>
            <Link
              to="/builder"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              New Project
            </Link>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Subscription Info Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={32} />
                <div>
                  <h2 className="text-2xl font-bold">
                    {getPlanName(user?.plan)} Plan
                  </h2>
                  <p className="text-purple-100 text-sm">
                    {user?.plan === "free"
                      ? "Limited credits available"
                      : user?.plan === "enterprise"
                      ? "Unlimited AI generations"
                      : "Monthly credits included"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-purple-100 text-sm mb-1">
                    Credits Remaining
                  </p>
                  <p className="text-3xl font-bold">
                    {user?.plan === "enterprise" ? "∞" : user?.credits || 0}
                  </p>
                </div>

                {usage && (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-purple-100 text-sm mb-1">
                        Used This Month
                      </p>
                      <p className="text-3xl font-bold">{usage.used || 0}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-purple-100 text-sm mb-1">
                        Next Billing
                      </p>
                      <p className="text-lg font-bold">
                        {usage.nextBillingDate
                          ? new Date(usage.nextBillingDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {user?.plan !== "free" && user?.plan !== "enterprise" && (
                <Link
                  to="/pricing"
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-2"
                >
                  <Zap size={18} />
                  Upgrade Plan
                </Link>
              )}

              {user?.plan === "free" && (
                <Link
                  to="/pricing"
                  className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-2"
                >
                  <Zap size={18} />
                  Upgrade Now
                </Link>
              )}

              {user?.plan !== "free" && (
                <>
                  <Link
                    to="/pricing"
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2"
                  >
                    <CreditCard size={18} />
                    Buy Credits
                  </Link>

                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="bg-red-500/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition"
                  >
                    Cancel Plan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <h1 className="text-3xl font-bold mb-8">My Projects</h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Folder className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first website with AI
            </p>
            <Link
              to="/builder"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              <Plus size={20} />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                {/* Project Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    {project.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Project Info */}
                <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link
                    to="/builder"
                    onClick={() => handleLoadProject(project._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    <Eye size={16} />
                    Open
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Cancel Subscription
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to cancel your subscription?
                </p>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Your subscription will remain active
                until the end of your current billing period. You'll still have
                access to all features until then.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCanceling}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {isCanceling ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Canceling...
                  </span>
                ) : (
                  "Cancel Plan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
