import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError} from "axios";
import Cookies from "js-cookie";

// Environment-based URLs
const GOLANG_API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_GOLANG_API_URL || "https://campuscompanionserver.fly.dev"
    : process.env.NEXT_PUBLIC_GOLANG_API_URL || "https://campuscompanionserver.fly.dev";

const LLM_API_URL =
  process.env.PRODUCTION_CHATBOT_API_URL || "https://5pgrpnef6shvo6xiewv5fkkrou.srv.us";

// Base configuration
const createBaseConfig = (baseURL: string): AxiosRequestConfig => ({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// golang backend client
const apiClient: AxiosInstance = axios.create(createBaseConfig(GOLANG_API_URL));
// llm backend client
const llmApiClient: AxiosInstance = axios.create(createBaseConfig(LLM_API_URL));

// Shared interceptor function for authentication
const addAuthInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      const serviceToken = Cookies.get("serviceToken");
      if (serviceToken) {
        config.headers.Authorization = `Bearer ${serviceToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        // handle errors here
      }
      return Promise.reject(error);
    },
  );
};

const createApiWrapper = (client: AxiosInstance) => ({
  GET: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.get<T>(url, config),
  POST: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => client.post<T>(url, data, config),
  PUT: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.put<T>(url, data, config),
  PATCH: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> => client.patch<T>(url, data, config),
  DELETE: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    client.delete<T>(url, config),
});

// Apply interceptors to both clients
addAuthInterceptor(apiClient);
addAuthInterceptor(llmApiClient);
export const api = createApiWrapper(apiClient);
export const llmApi = createApiWrapper(llmApiClient);
// Friendly alias for LLM client usage
export const llmClient = llmApi;

// Export clients for advanced usage
export {apiClient, llmApiClient};
export default apiClient;
