'use client';

import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import AppThemeProvider from '@/providers/AppThemeProvider';
import NavbarWithTheme from '@/components/NavbarWithTheme';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Jesnie</title>
        <meta name="description" content="My portfolio website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `,
          }}
        />

        <link
          rel="icon"
          type="image/png"
          href="/icons/light-logo.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          href="/icons/dark-logo.png"
          media="(prefers-color-scheme: dark)"
        />
      </head>

      <body className={inter.className}>
        <AppThemeProvider>
          {!isAdmin && <NavbarWithTheme />}

          <div className="bg-primary-light dark:bg-primary-dark">
            <main className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 md:px-8">
              {children}
            </main>
          </div>

          {!isAdmin && <Footer />}

          <Toaster
            position="top-right"
            toastOptions={{
              className:
                'bg-primary-light text-black dark:bg-primary-dark dark:text-white',
            }}
          />
        </AppThemeProvider>
      </body>
    </html>
  );
}
