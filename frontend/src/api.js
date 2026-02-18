import axios from "axios";
import { apiBaseUrl } from "./lib/utils";

export const API_BASE_URL = apiBaseUrl;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
