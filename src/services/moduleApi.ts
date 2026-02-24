import { api, handleApiError } from './api';
import type { Modulo, ContenidoModulo } from "@/types";

export const getModules = async (estado?: string): Promise<Modulo[]> => {
  try {
    const response = await api.get<Modulo[]>('/modules', { params: { estado } });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getModuleById = async (id: string): Promise<Modulo> => {
  try {
    const response = await api.get<Modulo>(`/modules/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getModuleByOrder = async (order: number): Promise<Modulo> => {
  try {
    const response = await api.get<Modulo>(`/modules/by-order/${order}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Funciones del profesor
export const createModule = async (data: Partial<Modulo>): Promise<Modulo> => {
  try {
    const response = await api.post<Modulo>('/modules', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const updateModule = async (id: string, data: Partial<Modulo>): Promise<Modulo> => {
  try {
    const response = await api.put<Modulo>(`/modules/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const deleteModule = async (id: string): Promise<void> => {
  try {
    await api.delete(`/modules/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const publishModule = async (id: string): Promise<void> => {
  try {
    await api.post(`/modules/${id}/publish`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const duplicateModule = async (id: string): Promise<Modulo> => {
  try {
    const response = await api.post<Modulo>(`/modules/${id}/duplicate`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getModuleStats = async (): Promise<any[]> => {
  try {
    const response = await api.get("/modules/stats");
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Funciones para la gestión de contenido de módulos
export const getContenidoByModuloId = async (moduloId: string): Promise<ContenidoModulo[]> => {
  try {
    const response = await api.get<ContenidoModulo[]>(`/modules/${moduloId}/contenido`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const createContenido = async (moduloId: string, data: Partial<ContenidoModulo>): Promise<ContenidoModulo> => {
  try {
    const response = await api.post<ContenidoModulo>(`/modules/${moduloId}/contenido`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const updateContenido = async (moduloId: string, contenidoId: string, data: Partial<ContenidoModulo>): Promise<ContenidoModulo> => {
  try {
    const response = await api.put<ContenidoModulo>(`/modules/${moduloId}/contenido/${contenidoId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const deleteContenido = async (moduloId: string, contenidoId: string): Promise<void> => {
  try {
    await api.delete(`/modules/${moduloId}/contenido/${contenidoId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const updateContenidoOrder = async (moduloId: string, newOrder: { id: string; orden: number }[]): Promise<void> => {
  try {
    await api.put(`/modules/${moduloId}/contenido/order`, { newOrder });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
