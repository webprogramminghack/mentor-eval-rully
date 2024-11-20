import '@/scss/globals.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BootstrappedApp } from './BootstrappedApp.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <BootstrappedApp />
    </StrictMode>
  </QueryClientProvider>
);
