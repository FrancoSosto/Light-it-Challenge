import { lazy, Suspense, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { actualizarPaciente, crearPaciente } from '@/features/patients/services/patientService';
import { type IPaciente, type IPacientePayload } from '@/types';

// Lazy loading de componentes más pesados para mejorar el FCP
const PatientForm = lazy(() =>
  import('@/features/patients/components/PatientForm').then((m) => ({ default: m.PatientForm })),
);
const PatientList = lazy(() =>
  import('@/features/patients/components/PatientList').then((m) => ({ default: m.PatientList })),
);

export function PanelPacientes() {
  const clienteQueries = useQueryClient();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pacienteEnEdicion, setPacienteEnEdicion] = useState<IPaciente | null>(null);
  const [tarjetaExpandida, setTarjetaExpandida] = useState<string | null>(null);
  const { mostrar } = useToast();

  const modoFormulario = useMemo(() => (pacienteEnEdicion ? 'editar' : 'crear'), [pacienteEnEdicion]);

  const mutacionCrear = useMutation({
    mutationFn: (datos: IPacientePayload) => crearPaciente(datos),
    onSuccess: async () => {
      await clienteQueries.invalidateQueries({ queryKey: ['pacientes'] });
      mostrar('Paciente creado con éxito', 'exito');
      cerrarModal();
    },
    onError: (error) => {
      const mensaje = error instanceof Error ? error.message : 'No pudimos crear el paciente';
      mostrar(mensaje, 'error');
    },
  });

  const mutacionActualizar = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IPacientePayload }) => actualizarPaciente(id, payload),
    onSuccess: async () => {
      await clienteQueries.invalidateQueries({ queryKey: ['pacientes'] });
      mostrar('Paciente actualizado', 'exito');
      cerrarModal();
      setPacienteEnEdicion(null);
    },
    onError: (error) => {
      const mensaje = error instanceof Error ? error.message : 'No pudimos actualizar el paciente';
      mostrar(mensaje, 'error');
    },
  });

  const abrirModalCreacion = () => {
    setPacienteEnEdicion(null);
    setModalAbierto(true);
  };

  const abrirModalEdicion = (paciente: IPaciente) => {
    setPacienteEnEdicion(paciente);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPacienteEnEdicion(null);
  };

  const manejarEnvio = async (datos: IPacientePayload) => {
    if (modoFormulario === 'crear') {
      await mutacionCrear.mutateAsync(datos);
    } else if (pacienteEnEdicion) {
      await mutacionActualizar.mutateAsync({ id: pacienteEnEdicion.id, payload: datos });
    }
  };

  const estaCargando = mutacionCrear.isPending || mutacionActualizar.isPending;

  const manejarToggleTarjeta = (id: string) => {
    setTarjetaExpandida((actual) => (actual === id ? null : id));
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-texto">Gestión de Pacientes</h1>
          <p className="text-sm text-mute">Administra perfiles, notas y enlaces clave sincronizados con la API mock.</p>
        </div>
        <Button onClick={abrirModalCreacion}>Agregar paciente</Button>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <PatientList
          onEditar={abrirModalEdicion}
          tarjetaExpandida={tarjetaExpandida}
          onToggleExpandir={manejarToggleTarjeta}
        />
      </Suspense>

      <Modal
        abierto={modalAbierto}
        onClose={cerrarModal}
        titulo={modoFormulario === 'crear' ? 'Nuevo paciente' : 'Editar paciente'}
        descripcion="Completa la información obligatoria para guardar los cambios."
      >
        <Suspense fallback={<div className="text-center text-mute">Cargando formulario...</div>}>
          <PatientForm
            modo={modoFormulario}
            paciente={pacienteEnEdicion ?? undefined}
            alEnviar={manejarEnvio}
            estaCargando={estaCargando}
          />
        </Suspense>
      </Modal>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, indice) => (
        <Card key={indice} className="h-full animate-fade-up space-y-4 bg-panel/70">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-borde/60 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded bg-borde/60 animate-pulse" />
              <div className="h-3 w-20 rounded bg-borde/40 animate-pulse" />
            </div>
          </div>
          <div className="h-3 w-full rounded bg-borde/50 animate-pulse" />
          <div className="h-3 w-2/3 rounded bg-borde/40 animate-pulse" />
        </Card>
      ))}
    </div>
  );
}
