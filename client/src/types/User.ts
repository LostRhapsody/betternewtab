import type { Link } from "./Link";

// this is the "Supabase" User type, i.e. exactly what is in the supabase table
export type User = {
  id: string;
  email: string;
  createdAt: string;
  auth_token?: string;
};

// this is the "Pinia" User type, i.e. what we want to store in the store
export type UserState = {
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
  auth_token: string | null;
};

// Simple user object for auth methods
export type AuthUser = {
  id: string;
  email: string;
};

// Response from login/register endpoints
export type AuthResponse = {
  token: string;
  user: User;
};

export type UserDataResponse = {
  user: User;
  settings: settings_blob;
  links: Link[];
};

export type settings_blob = {
  settings_blob: object;
};
