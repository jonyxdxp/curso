import { useState, useEffect, useCallback } from 'react';
import type { Estudiante, EstudianteDetail } from '@/types';
import * as studentApi from '@/services/studentApi';

interface UseStudentsOptions {
  estado?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const useStudents = (options: UseStudentsOptions = {}) => {
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentApi.getStudents(options);
      setStudents(data.estudiantes);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando estudiantes');
    } finally {
      setIsLoading(false);
    }
  }, [options.estado, options.search, options.page, options.limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    isLoading,
    error,
    pagination,
    refetch: fetchStudents
  };
};

export const useStudentDetail = (id: string) => {
  const [student, setStudent] = useState<EstudianteDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentApi.getStudentDetail(id);
      setStudent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando estudiante');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  return { student, isLoading, error, refetch: fetchStudent };
};
