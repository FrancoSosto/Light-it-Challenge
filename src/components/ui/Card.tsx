import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TarjetaProps extends HTMLAttributes<HTMLDivElement> {
  titulo?: string;
}

export function Card({ children, className, titulo, ...props }: TarjetaProps) {
  return (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-2xl border border-borde bg-panel/80 p-5 text-texto shadow-vidrio ring-1 ring-white/5 transition hover:-translate-y-[2px] hover:shadow-suave',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-acento/40 to-transparent" />
      {titulo && <h3 className="mb-3 text-lg font-semibold text-texto">{titulo}</h3>}
      {children}
    </div>
  );
}
