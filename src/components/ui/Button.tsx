import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variante = 'primary' | 'ghost';

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  estaCargando?: boolean;
}

export function Button({
  children,
  className,
  variante = 'primary',
  disabled,
  estaCargando = false,
  ...props
}: BotonProps) {
  const baseEstilos =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acento text-texto';

  const variantes: Record<Variante, string> = {
    primary:
      'bg-acento text-fondo shadow-suave hover:-translate-y-[1px] hover:shadow-lg active:translate-y-0 disabled:bg-acento/50 disabled:text-fondo/80 disabled:cursor-not-allowed',
    ghost:
      'border border-borde bg-white/5 text-texto hover:border-acento hover:text-acento disabled:text-mute disabled:border-borde disabled:cursor-not-allowed',
  };

  return (
    <button className={cn(baseEstilos, variantes[variante], className)} disabled={disabled || estaCargando} {...props}>
      {estaCargando && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-texto border-b-transparent" aria-hidden />
      )}
      {children}
    </button>
  );
}
