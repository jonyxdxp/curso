import { api, handleApiError } from './api';
import { DashboardEstudiante, ProgresoModulo, Estudiante, EstudianteDetail } from '@/types';

interface PaginatedEstudiantes {
  estudiantes: Estudiante[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getMyDashboard = async (): Promise<DashboardEstudiante> => {
  try {
    const response = await api.get<DashboardEstudiante>('/dashboard/student');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getMyProgress = async (): Promise<{ progresoGeneral: number; progresoDetalle: ProgresoModulo[] }> => {
  try {
    const response = await api.get('/students/me/progress');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const updateProgress = async (moduloId: string, completudPorcentaje: number): Promise<void> => {
  try {
    await api.post(`/students/me/progress/${moduloId}`, { completudPorcentaje });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const markModuleComplete = async (moduloId: string): Promise<void> => {
  try {
    await api.post(`/students/me/progress/${moduloId}/complete`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Funciones del profesor
export const getStudents = async (params?: { estado?: string; search?: string; page?: number; limit?: number }): Promise<PaginatedEstudiantes> => {
  try {
    const response = await api.get<PaginatedEstudiantes>('/students', { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getStudentDetail = async (id: string): Promise<EstudianteDetail> => {
  try {
    const response = await api.get<EstudianteDetail>(`/students/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
