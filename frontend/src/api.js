import axios from "axios";
import { apiBaseUrl } from "./lib/utils";

export const API_BASE_URL = apiBaseUrl;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

