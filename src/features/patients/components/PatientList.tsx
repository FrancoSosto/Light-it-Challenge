import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { type IPaciente } from '@/types';
import { obtenerPacientes } from '../services/patientService';
import { PatientCard } from './PatientCard';

interface PropiedadesListadoPacientes {
  onEditar: (paciente: IPaciente) => void;
  tarjetaExpandida: string | null;
  onToggleExpandir: (id: string) => void;
}

export function PatientList({ onEditar, tarjetaExpandida, onToggleExpandir }: PropiedadesListadoPacientes) {
  const {
    data: pacientes,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['pacientes'],
    queryFn: obtenerPacientes,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, indice) => (
          <Card key={indice} className="h-full animate-fade-up space-y-4 bg-panel/70">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-borde/60" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-borde/60" />
                <div className="h-3 w-20 rounded bg-borde/40" />
              </div>
            </div>
            <div className="h-3 w-full rounded bg-borde/50" />
            <div className="h-3 w-2/3 rounded bg-borde/40" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    const mensaje = error instanceof Error ? error.message : 'No pudimos cargar los pacientes';
    return (
      <Card className="flex flex-col items-center gap-3 bg-panel text-center text-sm text-red-300">
        <p>{mensaje}</p>
        <Button onClick={() => refetch()}>Reintentar</Button>
      </Card>
    );
  }

  if (!pacientes?.length) {
    return (
      <Card className="bg-panel text-center text-sm text-slate-300">
        Aún no hay pacientes registrados. Crea el primero para comenzar.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
      {pacientes.map((paciente, indice) => (
        <PatientCard
          key={paciente.id}
          paciente={paciente}
          onEditar={onEditar}
          onToggle={onToggleExpandir}
          expandida={tarjetaExpandida === paciente.id}
          indice={indice}
        />
      ))}
    </div>
  );
}
