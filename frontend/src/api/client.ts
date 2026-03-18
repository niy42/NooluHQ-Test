import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { API_URL } from "@/config/env";
import { store } from "@/redux/store";
import { ApiMethods } from "./apiMethod";
import { selectAuthToken } from "@/redux/store/slices/authSlice";

// ────────────────────────────────────────────────
// Type Definitions
// ────────────────────────────────────────────────

export interface RequestConfig<T = unknown> {
  path: string;
  method: ApiMethods;
  data?: T;
  params?: T;
  headers?: Record<string, string>;
  responseType?: "json" | "blob";
  baseUrl?: string;
  options?: {
    isDownload?: boolean;
    isPdf?: boolean;
    isFormData?: boolean;
    canShare?: boolean;
    fileName?: string;
  };
}

// ────────────────────────────────────────────────
// ApiClient Class
// ────────────────────────────────────────────────

class ApiClient {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: API_URL,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      timeout: 30000, // optional: prevent hanging requests
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // ─── Request interceptor ───
    this.http.interceptors.request.use((config) => {
      const token = selectAuthToken(store.getState());
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // ─── Response interceptor ───
    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 globally (can be extended later for logout / refresh)
        if (error.response?.status === 401) {
          console.warn("[API] Unauthorized - token may be invalid or expired");

          // Optional: you could dispatch a logout action here in the future
          // store.dispatch(logout());
        }

        // Return the error payload consistently (most backends return { message, error })
        return Promise.reject(error.response?.data || error.message || error);
      },
    );
  }

  async request<Req = unknown, Resp = unknown>(
    config: RequestConfig<Req>,
  ): Promise<Resp> {
    if (!this.http) {
      throw new Error("API Client not initialized");
    }

    const { options, ...axiosConfig } = config;

    // Build Axios-compatible config
    const axiosRequestConfig: AxiosRequestConfig = {
      url: axiosConfig.path,
      method: axiosConfig.method,
      headers: { ...axiosConfig.headers },
      baseURL: axiosConfig.baseUrl || API_URL,
      responseType: options?.isDownload || options?.isPdf ? "blob" : "json",
      [axiosConfig.method === ApiMethods.GET ? "params" : "data"]:
        axiosConfig.data,
    };

    try {
      const response = await this.http.request<Resp>(axiosRequestConfig);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  }
}

export const client = new ApiClient();
