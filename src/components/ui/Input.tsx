import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  mensajeError?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ etiqueta, className, mensajeError, id, ...props }, ref) => {
    const identificador = id ?? props.name;

    return (
      <label className="flex w-full flex-col gap-2 text-sm font-medium text-mute" htmlFor={identificador}>
        {etiqueta}
        <input
          id={identificador}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-borde bg-panel/80 px-3 py-2 text-sm text-texto shadow-inner outline-none transition focus:border-acento focus:ring-2 focus:ring-acento/30',
            mensajeError && 'border-red-500/70 focus:border-red-400 focus:ring-red-400/20',
            className,
          )}
          aria-invalid={Boolean(mensajeError)}
          aria-describedby={mensajeError ? `${identificador}-error` : undefined}
          {...props}
        />
        {mensajeError && (
          <span id={`${identificador}-error`} className="text-xs font-semibold text-red-300">
            {mensajeError}
          </span>
        )}
      </label>
    );
  },
);

Input.displayName = 'Input';
