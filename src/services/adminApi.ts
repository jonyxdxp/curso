import { api, handleApiError } from './api';
import type { DashboardProfesor, ConfiguracionProfesor } from '@/types';

interface DashboardSummary {
  estudiantes: {
    total: number;
    activos: number;
    pagados: number;
    pendientesPago: number;
    nuevosEstaSemana: number;
  };
  solicitudes: {
    pendientes: number;
  };
  modulos: {
    total: number;
    publicados: number;
  };
  finanzas: {
    ingresosTotales: number;
  };
}

interface DetailedStats {
  estudiantesPorMes: any[];
  pagosPorMes: any[];
  progresoPorModulo: any[];
  tasas: {
    aprobacion: number;
    conversion: number;
  };
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await api.get<DashboardSummary>('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getProfessorDashboard = async (): Promise<DashboardProfesor> => {
  try {
    const response = await api.get<DashboardProfesor>('/dashboard/professor');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getDetailedStats = async (): Promise<DetailedStats> => {
  try {
    const response = await api.get<DetailedStats>('/admin/stats');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getConfig = async (): Promise<{ profesorId: string; configuracion: ConfiguracionProfesor }> => {
  try {
    const response = await api.get('/admin/config');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const updateConfig = async (data: Partial<ConfiguracionProfesor>): Promise<{ message: string; config: ConfiguracionProfesor }> => {
  try {
    const response = await api.put('/admin/config', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const setStripeKeys = async (data: {
  stripeSecretKey: string;
  stripePublicKey: string;
  stripeWebhookSecret: string;
}): Promise<{ message: string }> => {
  try {
    const response = await api.post('/admin/stripe-keys', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getRecentActivity = async (): Promise<{ ultimas24Horas: any }> => {
  try {
    const response = await api.get('/dashboard/activity');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const createInitialProfessor = async (data: {
  email: string;
  password: string;
  nombre: string;
}): Promise<{ message: string; user: any }> => {
  try {
    const response = await api.post('/admin/setup', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
