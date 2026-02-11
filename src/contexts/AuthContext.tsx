import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '@/types';

import * as authApi from '@/services/authApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfessor: boolean;
  isStudent: boolean;
  hasPaid: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'poetica_access_token';
const REFRESH_TOKEN_KEY = 'poetica_refresh_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const userData = await authApi.getProfile();
          setUser(userData);
        } catch (error) {
          // Token inválido, limpiar
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await authApi.register(data);
    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch (error) {
      logout();
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isProfessor: user?.rol === 'profesor',
    isStudent: user?.rol === 'estudiante',
    hasPaid: user?.estudiante?.estadoPago === 'pagado',
    login,
    register,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// Helper para obtener el token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};
