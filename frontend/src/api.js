import axios from "axios";
import { apiBaseUrl } from "./lib/utils";

// Standardize base URL with the /api prefix
export const API_BASE_URL = `${apiBaseUrl}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Endpoint Constants (Single source of truth)
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  PROFILE: "/auth/profile",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

export const PRODUCT_ENDPOINTS = {
  LIST: "/products",
  DETAIL: (id) => `/products/${id}`,
};

export const CATEGORY_ENDPOINTS = {
  LIST: "/categories",
  DETAIL: (id) => `/categories/${id}`,
};

export const ORDER_ENDPOINTS = {
  LIST: "/orders",
  MY: "/orders/my",
  DETAIL: (id) => `/orders/${id}`,
  STATUS: (id) => `/orders/${id}/status`,
};

export const PRESCRIPTION_ENDPOINTS = {
  LIST: "/prescriptions",
  MY: "/prescriptions/my",
  DETAIL: (id, action) => `/prescriptions/${id}/${action}`,
  IMAGE: (id) => `/prescriptions/${id}/image`,
};

export const OFFER_ENDPOINTS = {
  LIST: "/offers",
};

export const ARTICLE_ENDPOINTS = {
  LIST: "/articles",
  DETAIL: (id) => `/articles/${id}`,
};

export const SETTINGS_ENDPOINTS = {
  ABOUT: "/settings/about",
};

export const ADMIN_ENDPOINTS = {
  ARTICLES: "/admin/articles",
  ARTICLE_DETAIL: (id) => `/admin/articles/${id}`,
  DASHBOARD: "/admin/dashboard",
  OFFERS: "/admin/offers",
  OFFER_DETAIL: (id) => `/admin/offers/${id}`,
  SETTINGS_ABOUT: "/admin/settings/about",
  STAFF: "/admin/staff",
  STAFF_DETAIL: (id) => `/admin/staff/${id}`,
};

// Interceptor to strip duplicate /api paths
apiClient.interceptors.request.use(
  (config) => {
    let url = config.url || "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      url = url.replace(/\/api\/api\/api\//g, "/api/").replace(/\/api\/api\//g, "/api/");
    } else {
      if (url.startsWith("/api/")) {
        url = url.substring(4);
      } else if (url === "/api") {
        url = "/";
      }
    }
    config.url = url;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to reject HTML responses when expecting JSON
apiClient.interceptors.response.use(
  (response) => {
    const contentType = response.headers["content-type"] || "";
    if (
      contentType.includes("text/html") ||
      (typeof response.data === "string" && response.data.trim().startsWith("<!DOCTYPE")) ||
      (typeof response.data === "string" && response.data.trim().startsWith("<html"))
    ) {
      return Promise.reject(
        new Error(
          "API returned HTML instead of JSON. Ensure backend server is running and API base URL is correct."
        )
      );
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

