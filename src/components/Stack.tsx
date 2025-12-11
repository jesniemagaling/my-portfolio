'use client';

import SectionHeader from '@/components/SectionHeader';
import { PrimaryButton, SecondaryButton } from '@/components/CustomButtons';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '@/lib/axios';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  'All',
  'Front-End',
  'Back-End',
  'Database',
  'DevOps',
  'Tools',
];

interface StackItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  link?: string;
}

export default function Stack() {
  const [stackItems, setStackItems] = useState<StackItem[]>([]);
  const [selected, setSelected] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLAnchorElement[]>([]);

  // Fetch stack items from public API
  useEffect(() => {
    const fetchStack = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/tech-stack'); // public API endpoint
        setStackItems(res.data);
      } catch (err: any) {
        console.error('Error fetching stack:', err);
        setError('Failed to load tech stack.');
      } finally {
        setLoading(false);
      }
    };

    fetchStack();
  }, []);

  const filtered =
    selected === 'All'
      ? stackItems
      : stackItems.filter((item) => item.category === selected);

  // GSAP animation
  useEffect(() => {
    if (loading || !stackItems.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Header animation
      tl.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );

      // Buttons animation
      if (buttonsRef.current) {
        tl.from(
          buttonsRef.current.children,
          {
            y: 20,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.05,
          },
          '-=0.2'
        );
      }

      // Stack items animation
      tl.from(
        itemsRef.current,
        { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05 },
        '-=0.2'
      );
    });

    return () => ctx.revert();
  }, [loading, stackItems]);

  if (loading) return <p className="mt-10 text-center">Loading stack...</p>;
  if (error) return <p className="mt-10 text-center text-red-500">{error}</p>;
  if (!stackItems.length)
    return <p className="mt-10 text-center">No stack items found.</p>;

  return (
    <>
      <div ref={headerRef}>
        <SectionHeader
          title="Tech Stack"
          description="These are the technologies, frameworks, and tools I use to bring ideas to life, covering everything from frontend to backend development."
        />
      </div>

      <div ref={buttonsRef} className="flex flex-wrap gap-2 mt-5 mb-10">
        {categories.map((cat) =>
          selected === cat ? (
            <PrimaryButton key={cat} onClick={() => setSelected(cat)}>
              {cat}
            </PrimaryButton>
          ) : (
            <SecondaryButton key={cat} onClick={() => setSelected(cat)}>
              {cat}
            </SecondaryButton>
          )
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {filtered.map((tech, i) => (
          <a
            key={tech.id}
            href={tech.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            ref={(el) => {
              if (el) itemsRef.current[i] = el;
            }}
            className="flex flex-col items-center justify-center px-2 py-4 space-y-2 shadow-sm dark:border-gray-700"
          >
            <div className="relative w-16 h-16">
              <Image
                src={tech.icon}
                alt={tech.name}
                fill
                className="object-contain transition hover:scale-105"
              />
            </div>
            <p className="text-sm font-medium md:text-lg">{tech.name}</p>
          </a>
        ))}
      </div>
    </>
  );
}
