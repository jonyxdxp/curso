import { useState, useEffect, useCallback } from 'react';
import { SolicitudAcceso } from '@/types';
import * as applicationApi from '@/services/applicationApi';

interface UseApplicationsOptions {
  estado?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const useApplications = (options: UseApplicationsOptions = {}) => {
  const [applications, setApplications] = useState<SolicitudAcceso[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await applicationApi.getApplications(options);
      setApplications(data.solicitudes);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando solicitudes');
    } finally {
      setIsLoading(false);
    }
  }, [options.estado, options.search, options.page, options.limit]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const approveApplication = async (id: string) => {
    const result = await applicationApi.approveApplication(id);
    await fetchApplications();
    return result;
  };

  const rejectApplication = async (id: string, motivo?: string) => {
    const result = await applicationApi.rejectApplication(id, motivo);
    await fetchApplications();
    return result;
  };

  return {
    applications,
    isLoading,
    error,
    pagination,
    refetch: fetchApplications,
    approveApplication,
    rejectApplication
  };
};

export const useApplicationStats = () => {
  const [stats, setStats] = useState<{
    total: number;
    pendientes: number;
    aprobadas: number;
    rechazadas: number;
    tasaAprobacion: number;
    tasaRechazo: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await applicationApi.getApplicationStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando estadísticas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};
