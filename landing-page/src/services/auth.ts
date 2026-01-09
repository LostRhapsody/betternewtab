import axios from "axios";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
});

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await authApi.post<AuthResponse>("/api/auth/register", {
      email,
      password,
    });
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem("token", token);
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  clearToken(): void {
    localStorage.removeItem("token");
  },

  getAppUrl(): string {
    return import.meta.env.VITE_APP_URL || "http://localhost:5173";
  },

  redirectToApp(): void {
    window.location.href = this.getAppUrl();
  },
};
