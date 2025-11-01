// src/apis/axios.ts
import axios, { AxiosError } from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEYS } from "../constants/key";
import { postRefresh } from "./auth";

const BASE_URL = import.meta.env.VITE_SERVER_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? "";

const getToken = (key: string) => {
  const raw = window.localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};
const setToken = (key: string, value: string) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
const removeToken = (key: string) => {
  window.localStorage.removeItem(key);
};

const ACCESS_KEY = LOCAL_STORAGE_KEYS.ACCESS_TOKEN;
const REFRESH_KEY = LOCAL_STORAGE_KEYS.REFRESH_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = getToken(ACCESS_KEY);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

const processQueue = (token: string) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    if (!original || original._retry) {
      return Promise.reject(error);
    }

    if (status === 401 || status === 419) {
      original._retry = true;

      const refreshToken = getToken(REFRESH_KEY);
      if (!refreshToken) {
        removeToken(ACCESS_KEY);
        removeToken(REFRESH_KEY);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newAccess) => {
            original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` };
            resolve(api(original));
          });
        });
      }

      try {
        isRefreshing = true;
        const { data } = await postRefresh(refreshToken);
        const newAccess = data.data.accessToken;
        const newRefresh = data.data.refreshToken;

        setToken(ACCESS_KEY, newAccess);
        setToken(REFRESH_KEY, newRefresh);

        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        processQueue(newAccess);

        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` };
        return api(original);
      } catch (e) {
        removeToken(ACCESS_KEY);
        removeToken(REFRESH_KEY);
        window.location.href = "/login";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
