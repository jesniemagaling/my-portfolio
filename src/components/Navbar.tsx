'use client';

import { Github, Sun, Moon, Menu, X } from 'lucide-react';
import Image from 'next/image';
import {
  useRef,
  useLayoutEffect,
  useState,
  type SetStateAction,
  useEffect,
} from 'react';
import type { Dispatch } from 'react';
import gsap from 'gsap';

interface NavbarProps {
  mode: 'light' | 'dark';
  setMode: Dispatch<SetStateAction<'light' | 'dark'>>;
}

export default function Navbar({ mode, setMode }: NavbarProps) {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'back.out(1.7)', duration: 0.4 },
      });

      if (logoRef.current) tl.from(logoRef.current, { y: -30, opacity: 0 });
      if (linksRef.current) {
        const items = linksRef.current.querySelectorAll('li');
        if (items.length > 0)
          tl.from(items, { y: -20, opacity: 0, stagger: 0.12 }, '-=0.01');
      }
      if (iconsRef.current)
        tl.from(
          iconsRef.current.children,
          { y: -10, opacity: 0, stagger: 0.12 },
          '-=0.01'
        );
    });

    return () => ctx.revert();
  }, []);

  const toggleDarkMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    document.documentElement.classList.toggle('dark', newMode === 'dark');
    localStorage.setItem('theme', newMode);
  };

  const handleLinkClick = () => setIsOpen(false);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full px-4 py-3 bg-primary-light dark:bg-primary-dark md:px-8">
      <div className="flex max-w-[1440px] items-center">
        <a ref={logoRef} className="w-[36px]" href="#">
          {mode === 'dark' ? (
            <Image
              src="/icons/dark-logo.png"
              alt="jesnie-icon"
              width={36}
              height={36}
            />
          ) : (
            <Image
              src="/icons/light-logo.png"
              alt="jesnie-icon"
              width={36}
              height={36}
            />
          )}
        </a>
      </div>

      {/* Desktop menu */}
      <ul ref={linksRef} className="hidden gap-8 text-sm font-bold md:flex">
        {['Stack', 'Projects', 'About', 'Contact'].map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              className="transition-colors duration-100 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* Icons */}
      <div
        ref={iconsRef}
        className="items-center hidden pl-4 space-x-4 border-l border-gray-300 dark:border-gray-800 md:flex"
      >
        <a
          href="https://github.com/jesniemagaling"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
        </a>
        <button onClick={toggleDarkMode}>
          {mode === 'dark' ? (
            <Sun className="text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
          ) : (
            <Moon className="text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
          )}
        </button>
      </div>

      {/* Mobile toggle */}
      <button
        className="text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu */}
      <div
        className={`absolute left-0 top-14 z-10 w-full transform bg-primary-light transition-all duration-300 dark:bg-primary-dark md:hidden ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-5 opacity-0'
        }`}
      >
        <ul className="flex flex-col p-6 space-y-4 text-sm text-gray-300">
          {['Stack', 'Projects', 'About', 'Contact'].map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                onClick={handleLinkClick}
                className="font-semibold text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center p-6 pt-2 space-x-4">
          <a
            href="https://github.com/jesniemagaling"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
          </a>
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="focus:outline-none"
          >
            {mode === 'dark' ? (
              <Sun className="text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
            ) : (
              <Moon className="text-black transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
