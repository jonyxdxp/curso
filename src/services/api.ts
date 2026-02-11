import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAuthToken } from '@/contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://curso-vaip.onrender.com/api';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('poetica_access_token');
      localStorage.removeItem('poetica_refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper para manejar errores
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message || 'Error desconocido';
  }
  return 'Error desconocido';
};
