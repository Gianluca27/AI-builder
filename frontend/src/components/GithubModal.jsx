import { useState, useEffect } from "react";
import { X, Github, ExternalLink, Search, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { githubAPI } from "../services/api";

const GithubModal = ({ isOpen, onClose, projectCode, onLoadRepo }) => {
  const [activeTab, setActiveTab] = useState("load"); // "load" o "create"
  const [formData, setFormData] = useState({
    repoName: "",
    repoDescription: "",
    isPrivate: false,
    autoSync: true,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingRepo, setIsLoadingRepo] = useState(false);

  useEffect(() => {
    // Check if GitHub token exists in localStorage
    const githubToken = localStorage.getItem("github_token");
    if (githubToken) {
      setIsConnected(true);
      // Load repositories automatically
      loadRepositories(githubToken);
    }

    // Listen for messages from OAuth popup
    const handleMessage = (event) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "GITHUB_AUTH_SUCCESS") {
        toast.success("Connected to GitHub!");
        setIsConnected(true);
        setIsConnecting(false);
        setActiveTab("load"); // Switch to repositories tab

        const token = event.data.token;
        if (token) {
          loadRepositories(token);
        }
      } else if (event.data.type === "GITHUB_AUTH_ERROR") {
        toast.error(event.data.error || "Failed to connect to GitHub");
        setIsConnecting(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!isOpen) return null;

  const handleConnectGithub = async () => {
    setIsConnecting(true);
    try {
      const response = await githubAPI.initiateAuth();
      const authUrl = response.data.authUrl;

      // Open GitHub OAuth in popup window
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        "GitHub OAuth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for popup closure
      const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
          setIsConnecting(false);
        }
      }, 500);
    } catch (error) {
      console.error("GitHub auth error:", error);
      toast.error("Failed to connect to GitHub");
      setIsConnecting(false);
    }
  };

  const loadRepositories = async (token) => {
    setIsLoadingRepos(true);
    try {
      const response = await githubAPI.listRepos(token);
      if (response.success) {
        setRepositories(response.data.repositories);
      }
    } catch (error) {
      console.error("Failed to load repositories:", error);
      toast.error("Failed to load repositories");
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleLoadRepo = async (repoFullName) => {
    setIsLoadingRepo(true);
    try {
      const githubToken = localStorage.getItem("github_token");
      const response = await githubAPI.readRepo(repoFullName, githubToken);

      if (response.success) {
        toast.success(`Repository "${response.data.repoName}" loaded!`);
        onLoadRepo(response.data); // Callback to BuilderPage to load the code
        onClose();
      }
    } catch (error) {
      console.error("Failed to load repository:", error);
      toast.error("Failed to load repository");
    } finally {
      setIsLoadingRepo(false);
    }
  };

  const handleCreateRepo = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error("Please connect to GitHub first");
      return;
    }

    setIsCreating(true);

    try {
      const githubToken = localStorage.getItem("github_token");

      const response = await githubAPI.createRepo({
        repoName: formData.repoName,
        repoDescription: formData.repoDescription,
        isPrivate: formData.isPrivate,
        htmlCode: projectCode?.html || "",
        cssCode: projectCode?.css || "",
        jsCode: projectCode?.js || "",
        githubToken: githubToken,
      });

      if (response.success) {
        toast.success(`Repository created successfully!`);

        // Open the new repo in a new tab
        if (response.data.repoUrl) {
          window.open(response.data.repoUrl, "_blank");
        }

        // Refresh repositories list
        loadRepositories(githubToken);

        setFormData({
          repoName: "",
          repoDescription: "",
          isPrivate: false,
          autoSync: true,
        });
      }
    } catch (error) {
      console.error("Create repo error:", error);
      const errorMessage = error.response?.data?.message || "Failed to create repository";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("github_token");
    setIsConnected(false);
    setRepositories([]);
    toast.success("Disconnected from GitHub");
  };

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-cyan-400/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-cyan-400/20 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-400/30">
          <div className="flex items-center gap-3">
            <Github size={24} className="text-cyan-400" />
            <h2 className="text-2xl font-bold font-mono text-cyan-400">
              $ git init
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!isConnected ? (
            <div className="p-6">
              <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-6">
                <p className="text-sm font-mono text-emerald-400 mb-4">
                  // Connect your GitHub account to:
                </p>
                <ul className="text-sm font-mono text-emerald-400 space-y-2 mb-6 ml-4">
                  <li>• Load existing repositories</li>
                  <li>• Push new projects to GitHub</li>
                  <li>• Auto-sync your code</li>
                </ul>
                <button
                  onClick={handleConnectGithub}
                  disabled={isConnecting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-mono font-bold border-2 border-cyan-400"
                >
                  <Github size={18} />
                  {isConnecting ? "$ connecting..." : "$ connect github"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Connection Status */}
              <div className="bg-emerald-400/10 border-b border-emerald-400/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-emerald-400">
                    Connected to GitHub
                  </span>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-xs font-mono text-red-400 hover:text-red-300 underline"
                >
                  disconnect
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-cyan-400/30">
                <button
                  onClick={() => setActiveTab("load")}
                  className={`flex-1 px-6 py-3 font-mono text-sm transition ${
                    activeTab === "load"
                      ? "bg-cyan-400/10 text-cyan-400 border-b-2 border-cyan-400"
                      : "text-emerald-400 hover:text-cyan-400"
                  }`}
                >
                  $ git clone
                </button>
                <button
                  onClick={() => setActiveTab("create")}
                  className={`flex-1 px-6 py-3 font-mono text-sm transition ${
                    activeTab === "create"
                      ? "bg-cyan-400/10 text-cyan-400 border-b-2 border-cyan-400"
                      : "text-emerald-400 hover:text-cyan-400"
                  }`}
                >
                  $ git push
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "load" ? (
                  <div>
                    {/* Search */}
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400" size={16} />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="$ search repositories..."
                          className="w-full pl-10 pr-4 py-2 bg-black/50 border border-cyan-400/30 rounded focus:outline-none focus:border-cyan-400 text-white font-mono text-sm placeholder:text-emerald-400/50"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const token = localStorage.getItem("github_token");
                          if (token) loadRepositories(token);
                        }}
                        className="p-2 bg-black/50 border border-cyan-400/30 rounded hover:border-cyan-400 transition text-emerald-400 hover:text-cyan-400"
                        title="Refresh repositories"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>

                    {/* Repositories List */}
                    {isLoadingRepos ? (
                      <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-emerald-400 font-mono text-sm mt-3">$ loading...</p>
                      </div>
                    ) : filteredRepos.length === 0 ? (
                      <div className="text-center py-12">
                        <Github size={48} className="mx-auto mb-4 text-cyan-400/30" />
                        <p className="text-emerald-400 font-mono text-sm">
                          {searchTerm ? "// No repositories found" : "// No repositories yet"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredRepos.map((repo) => (
                          <button
                            key={repo.id}
                            onClick={() => handleLoadRepo(repo.fullName)}
                            disabled={isLoadingRepo}
                            className="w-full text-left p-4 bg-black/30 border border-cyan-400/30 rounded hover:border-cyan-400 hover:bg-cyan-400/5 transition group disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-mono text-white group-hover:text-cyan-400 transition font-bold">
                                  {repo.name}
                                </h3>
                                {repo.description && (
                                  <p className="text-xs font-mono text-emerald-400 mt-1">
                                    // {repo.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                  {repo.language && (
                                    <span className="text-xs font-mono text-cyan-400">
                                      {repo.language}
                                    </span>
                                  )}
                                  {repo.private && (
                                    <span className="text-xs font-mono text-red-400">
                                      Private
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ExternalLink size={14} className="text-emerald-400 group-hover:text-cyan-400 transition flex-shrink-0 mt-1" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleCreateRepo}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium font-mono text-emerald-400 mb-2">
                          // Repository Name *
                        </label>
                        <input
                          type="text"
                          value={formData.repoName}
                          onChange={(e) =>
                            setFormData({ ...formData, repoName: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-black/50 border-2 border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white font-mono placeholder:text-emerald-400/50 transition-colors"
                          placeholder="$ my-awesome-website"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium font-mono text-emerald-400 mb-2">
                          // Description (optional)
                        </label>
                        <textarea
                          value={formData.repoDescription}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              repoDescription: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-black/50 border-2 border-cyan-400/30 rounded-lg focus:outline-none focus:border-cyan-400 text-white font-mono placeholder:text-emerald-400/50 resize-none transition-colors"
                          placeholder="// Generated with AI Builder"
                          rows={2}
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.isPrivate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isPrivate: e.target.checked,
                              })
                            }
                            className="w-4 h-4 bg-black/50 border-2 border-cyan-400/30 rounded accent-cyan-400"
                          />
                          <span className="text-sm font-mono text-emerald-400 group-hover:text-cyan-400 transition">
                            Private repository
                          </span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={formData.autoSync}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                autoSync: e.target.checked,
                              })
                            }
                            className="w-4 h-4 bg-black/50 border-2 border-cyan-400/30 rounded accent-cyan-400"
                          />
                          <span className="text-sm font-mono text-emerald-400 group-hover:text-cyan-400 transition">
                            Auto-sync on save
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border-2 border-cyan-400/30 rounded-lg hover:border-cyan-400/50 transition font-mono text-emerald-400 hover:text-cyan-400"
                      >
                        $ cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating || !projectCode}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-mono font-bold flex items-center justify-center gap-2 border-2 border-cyan-400"
                      >
                        <Github size={16} />
                        {isCreating ? "$ pushing..." : "$ push"}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="mt-4 bg-cyan-400/10 border border-cyan-400/30 rounded-lg p-3">
                      <p className="text-xs font-mono text-cyan-400 flex items-start gap-2">
                        <ExternalLink size={12} className="mt-0.5" />
                        <span>
                          {projectCode ?
                            "Your code will be pushed to GitHub as a new repository." :
                            "Generate code first to push to GitHub."
                          }
                        </span>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GithubModal;
