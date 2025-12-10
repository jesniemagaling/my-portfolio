'use client';

import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

type Props = { children: React.ReactNode };

export default function AppThemeProvider({ children }: Props) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    setMounted(true);

    const observer = new MutationObserver(() => {
      setMode(html.classList.contains('dark') ? 'dark' : 'light');
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    setMode(html.classList.contains('dark') ? 'dark' : 'light');

    return () => observer.disconnect();
  }, []);

  const theme = createTheme({
    palette: { mode },
    typography: { fontFamily: 'Inter, sans-serif' },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            '&.Mui-focusVisible': { outline: 'none', boxShadow: 'none' },
          },
        },
      },
    },
  });

  if (!mounted) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
