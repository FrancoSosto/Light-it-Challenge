import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LazyImage } from '@/components/ui/LazyImage';
import { cn } from '@/lib/utils';
import { type IPaciente } from '@/types';
import { usePatientCard } from '../hooks/usePatientCard';

interface PropiedadesTarjetaPaciente {
  paciente: IPaciente;
  onEditar: (paciente: IPaciente) => void;
  onToggle: (id: string) => void;
  expandida: boolean;
  indice?: number;
}

export function PatientCard({ paciente, onEditar, onToggle, expandida, indice = 0 }: PropiedadesTarjetaPaciente) {
  const { fechaCreacion } = usePatientCard(paciente.createdAt);

  return (
    <Card
      className={cn(
        'group flex flex-col gap-4 overflow-hidden bg-panel/90 animate-fade-up',
        'min-h-[260px]',
        !expandida && 'max-h-[260px]',
      )}
      style={{
        animationDelay: `${indice * 60}ms`,
        transition: 'all 700ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-acento/40 via-acentoSuave/40 to-transparent" />
      <div className="flex items-start gap-4">
        <div className="relative">
          <LazyImage
            src={paciente.avatar}
            alt={`Avatar de ${paciente.name}`}
            className="h-16 w-16 rounded-2xl border border-borde object-cover shadow-inner"
          />
          <span className="absolute -right-2 -top-2 rounded-full bg-acento/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-acento">
            {paciente.id}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-texto">{paciente.name}</h3>
              <p className="text-xs uppercase tracking-[0.2em] text-mute">Creado el {fechaCreacion}</p>
            </div>
            <Button variante="ghost" onClick={() => onEditar(paciente)}>
              Editar
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'relative rounded-2xl border border-borde/70 bg-white/5 p-3 transition-all duration-500 ease-in-out overflow-hidden',
          expandida ? 'flex-1' : '',
        )}
      >
        <div
          className={cn(
            'transition-all duration-500 ease-in-out',
            expandida ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute invisible',
          )}
        >
          <div className="grid content-start gap-2">
            <p className="text-sm leading-relaxed text-texto">{paciente.description}</p>
            <a
              href={paciente.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-acento hover:underline"
            >
              {paciente.website}
            </a>
          </div>
        </div>
        <div
          className={cn(
            'transition-all duration-500 ease-in-out',
            !expandida ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute invisible',
          )}
        >
          <p className="line-clamp-3 text-sm leading-relaxed text-mute">{paciente.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variante="ghost" onClick={() => onToggle(paciente.id)} aria-expanded={expandida}>
          {expandida ? 'Ocultar detalles' : 'Ver detalles'}
        </Button>
        <span className="text-xs font-semibold uppercase tracking-wide text-mute">
          {expandida ? 'Vista extendida' : 'Resumen'}
        </span>
      </div>
    </Card>
  );
}
