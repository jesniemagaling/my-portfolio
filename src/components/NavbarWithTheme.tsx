'use client';
import React from 'react';
import Navbar from './Navbar';

export default function NavbarWithTheme() {
  const [mode, setMode] = React.useState<'light' | 'dark'>(
    (typeof window !== 'undefined' &&
      (localStorage.getItem('theme') as 'light' | 'dark')) ||
      'light'
  );

  React.useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', mode);
  }, [mode]);

  return <Navbar mode={mode} setMode={setMode} />;
}
