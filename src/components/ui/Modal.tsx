import { type PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps extends PropsWithChildren {
  abierto: boolean;
  onClose: () => void;
  titulo?: string;
  descripcion?: string;
  className?: string;
}

export function Modal({ abierto, onClose, children, titulo, descripcion, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!abierto) return;

    // Guardar el elemento que tenía foco antes de abrir el modal
    previousActiveElement.current = document.activeElement as HTMLElement;

    const manejarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (evento.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (evento.shiftKey && document.activeElement === firstElement) {
          lastElement?.focus();
          evento.preventDefault();
        } else if (!evento.shiftKey && document.activeElement === lastElement) {
          firstElement?.focus();
          evento.preventDefault();
        }
      }
    };

    const scrollPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', manejarTecla);

    // Enfocar el primer elemento enfocable al abrir
    setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector('button, [href], input, select, textarea') as HTMLElement;
      firstFocusable?.focus();
    }, 0);

    return () => {
      window.removeEventListener('keydown', manejarTecla);
      document.body.style.overflow = scrollPrevio;
      // Restaurar el foco al elemento que lo tenía antes
      previousActiveElement.current?.focus();
    };
  }, [abierto, onClose]);

  if (!abierto) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby={titulo ? 'modal-title' : undefined}
      aria-describedby={descripcion ? 'modal-description' : undefined}
    >
      <div
        ref={modalRef}
        className={cn(
          'w-full max-w-lg rounded-2xl border border-borde bg-panel/95 p-6 text-texto shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-200',
          className,
        )}
        onClick={(evento) => evento.stopPropagation()}
      >
        {(titulo || descripcion) && (
          <header className="mb-4 space-y-1">
            {titulo && (
              <h2 id="modal-title" className="text-xl font-semibold text-texto">
                {titulo}
              </h2>
            )}
            {descripcion && (
              <p id="modal-description" className="text-sm text-mute">
                {descripcion}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
