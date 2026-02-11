import { useState, useEffect, useCallback } from 'react';
import { DashboardEstudiante, DashboardProfesor } from '@/types';
import * as studentApi from '@/services/studentApi';
import * as adminApi from '@/services/adminApi';

export const useStudentDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardEstudiante | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentApi.getMyDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, isLoading, error, refetch: fetchDashboard };
};

export const useProfessorDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardProfesor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminApi.getProfessorDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, isLoading, error, refetch: fetchDashboard };
};
