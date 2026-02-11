import { api, handleApiError } from './api';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '@/types';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const updateProfile = async (data: { nombre?: string; avatarUrl?: string }): Promise<User> => {
  try {
    const response = await api.put<User>('/auth/profile', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await api.post('/auth/change-password', { currentPassword, newPassword });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const refreshToken = async (token: string): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await api.post('/auth/refresh', { refreshToken: token });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
