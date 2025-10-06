import { create } from "zustand";
import { aiAPI, projectsAPI } from "../services/api";
import toast from "react-hot-toast";

export const useBuilderStore = create((set, get) => ({
  // Estado
  currentProject: null,
  generatedCode: {
    html: "",
    css: "",
    js: "",
  },
  chatHistory: [],
  isGenerating: false,
  credits: null,
  activeTab: "preview",

  // Generar código con AI
  generateCode: async (prompt, options = {}) => {
    set({ isGenerating: true });

    // Agregar mensaje del usuario al chat
    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };
    set((state) => ({ chatHistory: [...state.chatHistory, userMessage] }));

    try {
      const response = await aiAPI.generate({
        prompt,
        ...options,
      });

      const { htmlCode, cssCode, jsCode, type, project } = response.data;

      set({
        generatedCode: {
          html: htmlCode,
          css: cssCode || "",
          js: jsCode || "",
        },
        isGenerating: false,
        credits: response.meta.creditsRemaining,
      });

      // Agregar mensaje del asistente
      const assistantMessage = {
        role: "assistant",
        content: `✨ Website generated! Type: ${type}`,
        timestamp: new Date(),
      };
      set((state) => ({
        chatHistory: [...state.chatHistory, assistantMessage],
      }));

      if (project) {
        set({ currentProject: project });
      }

      toast.success("Website generated successfully!");
      return { success: true, data: response.data };
    } catch (error) {
      set({ isGenerating: false });

      const errorMessage = error.response?.data?.message || "Generation failed";

      const assistantMessage = {
        role: "assistant",
        content: `❌ ${errorMessage}`,
        timestamp: new Date(),
      };
      set((state) => ({
        chatHistory: [...state.chatHistory, assistantMessage],
      }));

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Mejorar código existente
  improveCode: async (improvements) => {
    const { generatedCode } = get();

    set({ isGenerating: true });

    try {
      const response = await aiAPI.improve({
        code: generatedCode.html,
        improvements,
      });

      set({
        generatedCode: {
          html: response.data.htmlCode,
          css: generatedCode.css,
          js: generatedCode.js,
        },
        isGenerating: false,
        credits: response.meta.creditsRemaining,
      });

      toast.success("Code improved!");
      return { success: true };
    } catch (error) {
      set({ isGenerating: false });
      toast.error("Failed to improve code");
      return { success: false };
    }
  },

  // Guardar proyecto
  saveProject: async (name, description) => {
    const { generatedCode } = get();

    try {
      const response = await projectsAPI.create({
        name,
        description,
        htmlCode: generatedCode.html,
        cssCode: generatedCode.css,
        jsCode: generatedCode.js,
      });

      set({ currentProject: response.data });
      toast.success("Project saved!");
      return { success: true, project: response.data };
    } catch (error) {
      toast.error("Failed to save project");
      return { success: false };
    }
  },

  // Actualizar proyecto existente
  updateProject: async (updates) => {
    const { currentProject } = get();

    if (!currentProject) {
      toast.error("No project loaded");
      return { success: false };
    }

    try {
      const response = await projectsAPI.update(currentProject.id, updates);
      set({ currentProject: response.data });
      toast.success("Project updated!");
      return { success: true };
    } catch (error) {
      toast.error("Failed to update project");
      return { success: false };
    }
  },

  // Cargar proyecto
  loadProject: async (projectId) => {
    try {
      const response = await projectsAPI.getById(projectId);
      const project = response.data;

      set({
        currentProject: project,
        generatedCode: {
          html: project.htmlCode,
          css: project.cssCode || "",
          js: project.jsCode || "",
        },
        chatHistory: [
          {
            role: "assistant",
            content: `📦 Project "${project.name}" loaded`,
            timestamp: new Date(),
          },
        ],
      });

      return { success: true, project };
    } catch (error) {
      toast.error("Failed to load project");
      return { success: false };
    }
  },

  // Cargar template
  loadTemplate: async (templateId) => {
    try {
      const response = await templatesAPI.getById(templateId);
      const template = response.data;

      set({
        generatedCode: {
          html: template.htmlCode,
          css: template.cssCode || "",
          js: template.jsCode || "",
        },
        chatHistory: [
          {
            role: "assistant",
            content: `📦 Template "${template.name}" loaded. Customize it!`,
            timestamp: new Date(),
          },
        ],
      });

      toast.success("Template loaded!");
      return { success: true };
    } catch (error) {
      toast.error("Failed to load template");
      return { success: false };
    }
  },

  // Obtener créditos
  fetchCredits: async () => {
    try {
      const response = await aiAPI.getCredits();
      set({ credits: response.data.credits });
    } catch (error) {
      console.error("Failed to fetch credits");
    }
  },

  // Cambiar tab activo
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Limpiar todo
  reset: () =>
    set({
      currentProject: null,
      generatedCode: { html: "", css: "", js: "" },
      chatHistory: [],
      activeTab: "preview",
    }),

  // Actualizar código manualmente
  updateCode: (type, code) => {
    set((state) => ({
      generatedCode: {
        ...state.generatedCode,
        [type]: code,
      },
    }));
  },
}));
