import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { API_URL } from "@/config/env";
import { store } from "@/redux/store";
import { ApiMethods } from "./apiMethod";
import { logoutUser, selectAuthToken } from "@/redux/store/slices/authSlice";

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

class ApiClient {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: API_URL,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      timeout: 30000,
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    this.http.interceptors.request.use((config) => {
      const token = selectAuthToken(store.getState());
      console.log("Token sent through interceptors: ", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("[API] Unauthorized - token may be invalid or expired");
          store.dispatch(logoutUser());
          window.location.href = "/signup";
        }
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

    const axiosRequestConfig: AxiosRequestConfig = {
      url: axiosConfig.path,
      method: axiosConfig.method.toLowerCase() as AxiosRequestConfig["method"],
      headers: { ...axiosConfig.headers },
      baseURL: axiosConfig.baseUrl || API_URL,
      responseType: options?.isDownload || options?.isPdf ? "blob" : "json",
      data: axiosConfig.data,
      params: axiosConfig.params,
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
