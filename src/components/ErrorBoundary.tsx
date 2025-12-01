import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from './ui/Button';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-fondo p-4">
          <div className="max-w-md space-y-6 rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-500/10 to-red-600/5 p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <span className="text-3xl text-red-400">⚠</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-red-100">Algo salió mal</h1>
              <p className="text-sm text-red-200/80">
                La aplicación encontró un error inesperado. Por favor, intenta recargar la página.
              </p>
            </div>
            <details className="rounded-lg bg-red-950/30 p-4 text-left">
              <summary className="cursor-pointer text-sm font-semibold text-red-300">Ver detalles técnicos</summary>
              <pre className="mt-3 overflow-auto text-xs text-red-200/70">{this.state.error.message}</pre>
            </details>
            <div className="flex gap-3">
              <Button onClick={this.resetError} className="flex-1">
                Intentar nuevamente
              </Button>
              <Button onClick={() => window.location.reload()} variante="ghost" className="flex-1">
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
