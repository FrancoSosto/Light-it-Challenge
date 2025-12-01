import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

type TipoToast = 'exito' | 'error' | 'info';

interface ToastItem {
  id: string;
  tipo: TipoToast;
  mensaje: string;
  saliendo?: boolean;
}

interface ToastContexto {
  mostrar: (mensaje: string, tipo?: TipoToast) => void;
}

const ToastContext = createContext<ToastContexto | null>(null);

function crearId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const cerrar = useCallback((id: string) => {
    setToasts((previos) => previos.map((toast) => (toast.id === id ? { ...toast, saliendo: true } : toast)));
    setTimeout(() => {
      setToasts((previos) => previos.filter((toast) => toast.id !== id));
    }, 300);
  }, []);

  const mostrar = useCallback(
    (mensaje: string, tipo: TipoToast = 'info') => {
      const id = crearId();
      setToasts((previos) => [...previos, { id, tipo, mensaje, saliendo: false }]);
      setTimeout(() => cerrar(id), 4000);
    },
    [cerrar],
  );

  const valor = useMemo(() => ({ mostrar }), [mostrar]);

  const coloresPorTipo: Record<TipoToast, string> = {
    exito: 'border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10',
    error: 'border-red-500/40 bg-gradient-to-br from-red-500/20 to-red-600/10',
    info: 'border-sky-500/40 bg-gradient-to-br from-sky-500/20 to-blue-600/10',
  };

  const iconosPorTipo: Record<TipoToast, string> = {
    exito: '✓',
    error: '✕',
    info: 'i',
  };

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col items-end gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            aria-live="assertive"
            className={cn(
              'pointer-events-auto flex min-w-[320px] max-w-md items-center gap-4 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out',
              coloresPorTipo[toast.tipo],
              toast.saliendo
                ? 'opacity-0 translate-x-[400px] scale-95'
                : 'opacity-100 translate-x-0 scale-100 animate-in slide-in-from-right-5 fade-in duration-500',
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold',
                toast.tipo === 'exito' && 'bg-emerald-500/30 text-emerald-300',
                toast.tipo === 'error' && 'bg-red-500/30 text-red-300',
                toast.tipo === 'info' && 'bg-sky-500/30 text-sky-300',
              )}
            >
              {iconosPorTipo[toast.tipo]}
            </div>
            <p
              className={cn(
                'flex-1 text-sm font-medium leading-relaxed',
                toast.tipo === 'exito' && 'text-emerald-100',
                toast.tipo === 'error' && 'text-red-100',
                toast.tipo === 'info' && 'text-sky-100',
              )}
            >
              {toast.mensaje}
            </p>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white/90 transition-all duration-200 hover:bg-white/20 hover:scale-110 active:scale-95"
              onClick={() => cerrar(toast.id)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) throw new Error('useToast debe usarse dentro de ToastProvider');
  return contexto;
}
