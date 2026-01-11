import { API } from "@/constants/api";
import { useUserStore } from "@/stores/user";
import type { AuthResponse } from "@/types/User";
import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
});

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>(API.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>(API.REGISTER, {
      email,
      password,
    });
    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
    const userStore = useUserStore();
    userStore.clearUser();
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },

  setToken(token: string): void {
    localStorage.setItem("token", token);
  },
};

export default authService;
