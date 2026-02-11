import { api, handleApiError } from './api';
import type { Pago } from '@/types';

interface PaymentSession {
  sessionId: string;
  url: string;
}

interface PaymentStats {
  totalPagos: number;
  pagosCompletados: number;
  pagosPendientes: number;
  pagosReembolsados: number;
  ingresosTotales: number;
}

interface PaginatedPagos {
  pagos: (Pago & { nombre: string; email: string })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const createPaymentSession = async (): Promise<PaymentSession> => {
  try {
    const response = await api.post<PaymentSession>('/payments/create-session');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getMyPayments = async (): Promise<Pago[]> => {
  try {
    const response = await api.get<Pago[]>('/payments/my-payments');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const checkPaymentStatus = async (sessionId: string): Promise<{ status: string }> => {
  try {
    const response = await api.get(`/payments/status/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getCoursePrice = async (): Promise<{ precio: number; moneda: string }> => {
  try {
    const response = await api.get('/payments/price');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Funciones del profesor
export const getAllPayments = async (params?: { estado?: string; page?: number; limit?: number }): Promise<PaginatedPagos> => {
  try {
    const response = await api.get<PaginatedPagos>('/payments', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getPaymentStats = async (): Promise<PaymentStats> => {
  try {
    const response = await api.get<PaymentStats>('/payments/stats');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const processRefund = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.post(`/payments/refund/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const setCoursePrice = async (precio: number, moneda: string = 'USD'): Promise<{ message: string }> => {
  try {
    const response = await api.post('/payments/price', { precio, moneda });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
