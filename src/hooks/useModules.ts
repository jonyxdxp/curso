import { useState, useEffect, useCallback } from 'react';
import type { Modulo } from '@/types';
import * as moduleApi from '@/services/moduleApi';

export const useModules = (estado?: string) => {
  const [modules, setModules] = useState<Modulo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await moduleApi.getModules(estado);
      setModules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando módulos');
    } finally {
      setIsLoading(false);
    }
  }, [estado]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return { modules, isLoading, error, refetch: fetchModules };
};

export const useModule = (id: string) => {
  const [module, setModule] = useState<Modulo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModule = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await moduleApi.getModuleById(id);
      setModule(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando módulo');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  return { module, isLoading, error, refetch: fetchModule };
};

export const useModuleByOrder = (order: number) => {
  const [module, setModule] = useState<Modulo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModule = useCallback(async () => {
    if (!order) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await moduleApi.getModuleByOrder(order);
      setModule(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando módulo');
    } finally {
      setIsLoading(false);
    }
  }, [order]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  return { module, isLoading, error, refetch: fetchModule };
};
