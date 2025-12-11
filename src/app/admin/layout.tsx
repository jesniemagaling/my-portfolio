'use client';

import '@/styles/globals.css';
import { useState } from 'react';
import { Inter } from 'next/font/google';
import AppThemeProvider from '@/providers/AppThemeProvider';
import Footer from '@/components/Footer';
import AdminNavbar from '@/components/AdminNavbar';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  return (
    <AppThemeProvider>
      <div className="flex flex-col h-screen bg-primary-light dark:bg-primary-dark">
        <AdminNavbar mode={mode} setMode={setMode} />

        <main className="flex-1 overflow-auto relative mx-auto w-full max-w-[1440px] px-2 md:px-8">
          {children}
        </main>

        <Footer />
      </div>
    </AppThemeProvider>
  );
}
