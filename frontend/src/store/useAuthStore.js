import { create } from "zustand";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,

  // Register
  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.register(data);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true, isLoading: false });

      toast.success("Account created successfully!");
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Login
  login: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(data);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      set({ user, token, isAuthenticated: true, isLoading: false });

      toast.success("Welcome back!");
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, error: message };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
    toast.success("Logged out successfully");
  },

  // Get current user
  getMe: async () => {
    try {
      const response = await authAPI.getMe();
      set({ user: response.data.user });
    } catch (error) {
      localStorage.removeItem("token");
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  // Update profile
  updateProfile: async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      set({ user: response.data.user });
      toast.success("Profile updated!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return { success: false, error: message };
    }
  },
}));
