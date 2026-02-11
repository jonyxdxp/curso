import { useState, useEffect, useCallback } from 'react';
import { Pago } from '@/types';
import * as paymentApi from '@/services/paymentApi';

export const useCoursePrice = () => {
  const [price, setPrice] = useState<{ precio: number; moneda: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentApi.getCoursePrice();
      setPrice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando precio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return { price, isLoading, error, refetch: fetchPrice };
};

export const useMyPayments = () => {
  const [payments, setPayments] = useState<Pago[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentApi.getMyPayments();
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando pagos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, isLoading, error, refetch: fetchPayments };
};

export const usePaymentStats = () => {
  const [stats, setStats] = useState<{
    totalPagos: number;
    pagosCompletados: number;
    pagosPendientes: number;
    pagosReembolsados: number;
    ingresosTotales: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentApi.getPaymentStats();
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
