'use client';

import { AppProvider } from '../../context/AppContext';
import AppShell from '../layout/AppShell';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
