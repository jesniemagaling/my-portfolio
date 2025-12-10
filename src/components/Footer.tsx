'use client';

import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mb-5 mt-10 flex w-full justify-between gap-2 px-4 py-4 text-sm">
      <h2>
        © {new Date().getFullYear()} Jesnie Magaling. All rights reserved.
      </h2>
      <a
        href="https://github.com/jesniemagaling"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github className="text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
      </a>
    </footer>
  );
}
