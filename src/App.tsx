import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import { PanelPacientes } from '@/features/patients/components/PanelPacientes';

const clienteQuery = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={clienteQuery}>
        <ToastProvider>
          <div className="min-h-screen bg-fondo text-texto">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
              <PanelPacientes />
            </div>
          </div>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
