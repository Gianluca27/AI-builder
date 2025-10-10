import { useState } from "react";
import { X } from "lucide-react";
import { useBuilderStore } from "../store/useBuilderStore";
import toast from "react-hot-toast";

const SaveProjectModal = ({ isOpen, onClose }) => {
  const { saveProject } = useBuilderStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await saveProject(formData.name, formData.description);

    setIsSaving(false);

    if (result.success) {
      onClose();
      setFormData({ name: "", description: "" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border-2 border-yellow-400/50 rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-yellow-400/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-mono text-yellow-400">$ save_project</h2>
          <button
            onClick={onClose}
            className="text-yellow-400 hover:text-yellow-300 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium font-mono text-green-400 mb-2">
                // Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-black/50 border-2 border-yellow-400/30 rounded-lg focus:outline-none focus:border-yellow-400 text-white font-mono placeholder:text-green-400/50 transition-colors"
                placeholder="$ my_awesome_website"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium font-mono text-green-400 mb-2">
                // Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 bg-black/50 border-2 border-yellow-400/30 rounded-lg focus:outline-none focus:border-yellow-400 text-white font-mono placeholder:text-green-400/50 resize-none transition-colors"
                placeholder="// Brief description of your project..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-yellow-400/30 rounded-lg hover:border-yellow-400/50 transition font-mono text-green-400 hover:text-yellow-400"
            >
              $ cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed font-mono font-bold"
            >
              {isSaving ? "$ saving..." : "$ save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveProjectModal;
