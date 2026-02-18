import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiBaseUrl } from "@/lib/utils";
import { apiClient } from "@/api";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  setSession: (user: AuthUser, token: string) => void;
  clearSession: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKeyToken = "aura_auth_token";
const storageKeyUser = "aura_auth_user";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(storageKeyToken);
    const storedUser = localStorage.getItem(storageKeyUser);

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setUser(parsedUser);
        setToken(storedToken);
      } catch {
        localStorage.removeItem(storageKeyToken);
        localStorage.removeItem(storageKeyUser);
      }
    }
  }, []);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem(storageKeyToken, token);
      localStorage.setItem(storageKeyUser, JSON.stringify(user));
    } else {
      localStorage.removeItem(storageKeyToken);
      localStorage.removeItem(storageKeyUser);
    }
  }, [token, user]);

  const setSession = (nextUser: AuthUser, nextToken: string) => {
    setUser(nextUser);
    setToken(nextToken);
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    setSession,
    clearSession,
    isAuthenticated: Boolean(user && token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};

export const authFetch = async (input: string, init: RequestInit = {}, token?: string | null) => {
  const headers: Record<string, string> = {};

  if (init.headers) {
    const existing = init.headers as Record<string, string>;
    Object.assign(headers, existing);
  }

  if (!headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const method = init.method || "GET";
  const data = init.body ? JSON.parse(init.body as string) : undefined;

  try {
    const response = await apiClient.request({
      url: input,
      method,
      data,
      headers,
    });

    return response.data;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "response" in error) {
      const anyError = error as { response?: { data?: { message?: string } } };
      const message = anyError.response?.data?.message || "Request failed";
      throw new Error(message);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Request failed");
  }
};

export const authApi = {
  login: async (email: string, password: string) => {
    return authFetch(`${apiBaseUrl}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (name: string, email: string, password: string) => {
    return authFetch(`${apiBaseUrl}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
  createOrder: async (
    payload: {
      items: Array<{ productId?: string; name: string; brand?: string; price: number; quantity: number }>;
      shippingAddress: {
        line1: string;
        city: string;
        state: string;
        postalCode: string;
      };
      paymentMethod: "cod" | "online";
    },
    token: string,
  ) => {
    return authFetch(
      `${apiBaseUrl}/api/orders`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      token,
    );
  },
};
