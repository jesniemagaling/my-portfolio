'use client';

import { useEffect, useState } from 'react';
import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import AppThemeProvider from '@/providers/AppThemeProvider';
import Footer from '@/components/Footer';
import AdminNavbar from '@/components/AdminNavbar';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const pathname = usePathname();

  // Don't show navbar on login page
  const showNavbar = pathname !== '/admin/login';

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setMode(isDark ? 'dark' : 'light');
  }, []);

  if (!mounted) return null;

  return (
    <AppThemeProvider>
      <div className="flex flex-col h-screen bg-primary-light dark:bg-primary-dark">
        {showNavbar && <AdminNavbar mode={mode} setMode={setMode} />}

        <main className="flex-1 overflow-auto relative mx-auto w-full max-w-[1440px] px-2 md:px-8">
          {children}
        </main>

        <Footer />
      </div>
    </AppThemeProvider>
  );
}
