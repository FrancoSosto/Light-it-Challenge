import { useMemo } from 'react';

export function usePatientCard(createdAt: string) {
  const fechaCreacion = useMemo(() => {
    return new Date(createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [createdAt]);

  return { fechaCreacion };
}
