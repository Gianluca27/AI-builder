import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==========================================
// AUTH API
// ==========================================

export const authAPI = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/auth/update", data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },
};

// ==========================================
// AI API
// ==========================================

export const aiAPI = {
  generate: async (data) => {
    const response = await api.post("/ai/generate", data);
    return response.data;
  },

  improve: async (data) => {
    const response = await api.post("/ai/improve", data);
    return response.data;
  },

  getSuggestions: async (prompt) => {
    const response = await api.post("/ai/suggestions", { prompt });
    return response.data;
  },

  getCredits: async () => {
    const response = await api.get("/ai/credits");
    return response.data;
  },

  // Transcribe audio to text
  transcribe: async (audioBlob, language = "es") => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("language", language);

    const response = await api.post("/ai/transcribe", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

// ==========================================
// PROJECTS API
// ==========================================

export const projectsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get("/projects", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/projects", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  duplicate: async (id) => {
    const response = await api.post(`/projects/${id}/duplicate`);
    return response.data;
  },

  getPublic: async (params = {}) => {
    const response = await api.get("/projects/public/explore", { params });
    return response.data;
  },
};

// ==========================================
// TEMPLATES API
// ==========================================

export const templatesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get("/templates", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },
};

// ==========================================
// GITHUB API
// ==========================================

export const githubAPI = {
  // Initiate GitHub OAuth
  initiateAuth: async () => {
    const response = await api.get("/github/auth");
    return response.data;
  },

  // List user's repositories
  listRepos: async (githubToken) => {
    const response = await api.post("/github/repos", { githubToken });
    return response.data;
  },

  // Read repository content
  readRepo: async (repoFullName, githubToken) => {
    const response = await api.post("/github/read-repo", { repoFullName, githubToken });
    return response.data;
  },

  // Create a new repository
  createRepo: async (data) => {
    const response = await api.post("/github/create-repo", data);
    return response.data;
  },

  // Update existing repository
  updateRepo: async (data) => {
    const response = await api.post("/github/update-repo", data);
    return response.data;
  },

  // Disconnect GitHub account
  disconnect: async () => {
    const response = await api.post("/github/disconnect");
    return response.data;
  },
};

// ==========================================
// BILLING API (PayPal Integration)
// ==========================================

export const billingAPI = {
  // Obtener todos los planes disponibles
  getPlans: async () => {
    const response = await api.get("/billing/plans");
    return response.data;
  },

  // Crear suscripción (Basic, Pro, Enterprise)
  createSubscription: async (planId) => {
    const response = await api.post("/billing/create-subscription", { planId });
    return response.data;
  },

  // Crear orden de compra (Packs de créditos)
  createOrder: async (packId) => {
    const response = await api.post("/billing/create-order", { packId });
    return response.data;
  },

  // Capturar orden después del pago
  captureOrder: async (orderId) => {
    const response = await api.post("/billing/capture-order", { orderId });
    return response.data;
  },

  // Cancelar suscripción actual
  cancelSubscription: async () => {
    const response = await api.post("/billing/cancel-subscription");
    return response.data;
  },

  // Obtener uso y estadísticas
  getUsage: async () => {
    const response = await api.get("/billing/usage");
    return response.data;
  },
};

export default api;
