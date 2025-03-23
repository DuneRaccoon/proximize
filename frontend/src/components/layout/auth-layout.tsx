import React, { ReactNode } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Wallet Pass Manager</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wallet Pass Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
