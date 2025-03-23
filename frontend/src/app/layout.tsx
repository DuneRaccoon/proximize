import { AuthProvider } from '@/providers/auth-provider';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Wallet Pass Manager',
  description: 'A self-service SaaS platform for businesses to create and manage Apple/Google Wallet passes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
