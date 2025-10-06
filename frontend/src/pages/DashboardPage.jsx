import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Plus, Folder, Trash2, Eye, LogOut } from "lucide-react";
import { projectsAPI } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import { useBuilderStore } from "../store/useBuilderStore";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const { loadProject } = useBuilderStore();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

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
                {user?.plan} Plan
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
    </div>
  );
};

export default DashboardPage;
