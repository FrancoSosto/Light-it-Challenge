import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { type IPaciente, type IPacientePayload } from '@/types';
import { cn } from '@/lib/utils';

const esquemaPaciente = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  avatar: z.string().url('Debe ser una URL válida').min(1, 'La foto es obligatoria'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  website: z.string().url('Debe ser una URL válida'),
});

type FormularioPaciente = z.infer<typeof esquemaPaciente>;

interface PropiedadesFormularioPaciente {
  modo: 'crear' | 'editar';
  paciente?: IPaciente;
  alEnviar: (datos: IPacientePayload) => Promise<void> | void;
  estaCargando?: boolean;
  className?: string;
}

export function PatientForm({
  modo,
  paciente,
  alEnviar,
  estaCargando = false,
  className,
}: PropiedadesFormularioPaciente) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormularioPaciente>({
    resolver: zodResolver(esquemaPaciente),
    defaultValues: {
      name: paciente?.name ?? '',
      avatar: paciente?.avatar ?? '',
      description: paciente?.description ?? '',
      website: paciente?.website ?? '',
    },
  });

  useEffect(() => {
    if (paciente) {
      reset({
        name: paciente.name,
        avatar: paciente.avatar,
        description: paciente.description,
        website: paciente.website,
      });
    } else {
      reset({
        name: '',
        avatar: '',
        description: '',
        website: '',
      });
    }
  }, [paciente, reset]);

  const manejarEnvio = (datos: FormularioPaciente) => alEnviar(datos);

  return (
    <form className={cn('space-y-4', className)} onSubmit={handleSubmit(manejarEnvio)} noValidate>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          etiqueta="Nombre completo"
          placeholder="Jane Doe"
          {...register('name')}
          mensajeError={errors.name?.message}
        />
        <Input
          etiqueta="Foto (URL)"
          placeholder="https://..."
          {...register('avatar')}
          mensajeError={errors.avatar?.message}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-mute">
          Descripción
          <textarea
            className={cn(
              'min-h-[120px] rounded-xl border border-borde bg-panel/80 px-3 py-2 text-sm text-texto shadow-inner outline-none transition focus:border-acento focus:ring-2 focus:ring-acento/25',
              errors.description && 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20',
            )}
            placeholder="Breve biografía o notas clínicas"
            {...register('description')}
          />
          {errors.description?.message && (
            <span className="text-xs font-semibold text-red-300">{errors.description.message}</span>
          )}
        </label>
        <Input
          etiqueta="Sitio web"
          placeholder="https://ejemplo.com"
          {...register('website')}
          mensajeError={errors.website?.message}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" estaCargando={estaCargando}>
          {modo === 'crear' ? 'Crear paciente' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}
