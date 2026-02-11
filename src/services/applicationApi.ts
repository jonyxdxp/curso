import { api, handleApiError } from './api';
import { SolicitudAcceso } from '@/types';

interface PaginatedSolicitudes {
  solicitudes: SolicitudAcceso[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SolicitudStats {
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
  tasaAprobacion: number;
  tasaRechazo: number;
}

export const createApplication = async (data: {
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  experiencia?: string;
  interes?: string;
}): Promise<{ message: string; solicitud: SolicitudAcceso }> => {
  try {
    const response = await api.post('/applications', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getApplications = async (params?: { 
  estado?: string; 
  search?: string; 
  page?: number; 
  limit?: number 
}): Promise<PaginatedSolicitudes> => {
  try {
    const response = await api.get<PaginatedSolicitudes>('/applications', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getApplicationStats = async (): Promise<SolicitudStats> => {
  try {
    const response = await api.get<SolicitudStats>('/applications/stats');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getApplicationDetail = async (id: string): Promise<SolicitudAcceso> => {
  try {
    const response = await api.get<SolicitudAcceso>(`/applications/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const approveApplication = async (id: string): Promise<{ message: string; paymentUrl: string }> => {
  try {
    const response = await api.post(`/applications/${id}/approve`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const rejectApplication = async (id: string, motivo?: string): Promise<{ message: string }> => {
  try {
    const response = await api.post(`/applications/${id}/reject`, { motivo });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
