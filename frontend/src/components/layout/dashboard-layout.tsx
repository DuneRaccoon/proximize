import React, { ReactNode } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { useAuth } from '@/providers/auth-provider';
import { useRouter, usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !pathname?.startsWith('/auth')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:ml-64">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
