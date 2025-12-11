'use client';

import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  // Escape key listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, open]);

  // GSAP animation
  useEffect(() => {
    if (!open) return;
    const modal = document.getElementById('custom-modal');
    if (modal) {
      gsap.fromTo(
        modal,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power3.out' }
      );
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Background overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        id="custom-modal"
        className="relative z-10 w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-[rgba(255,255,255,0.06)] rounded-lg shadow-xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-gray-100">
              {title}
            </h2>
            <button
              className="text-2xl font-bold text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          {children}

          {/* Apply consistent input styles */}
          <style jsx>{`
            input,
            textarea {
              @apply w-full rounded-md border border-gray-600 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:outline-none focus:border-gray-800 dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400;
            }
          `}</style>
        </div>
      </div>
    </div>,
    document.body
  );
}
