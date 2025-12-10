'use client';

import { PrimaryButton, SecondaryButton } from '@/components/CustomButtons';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.2 });

    tl.fromTo(
      titleRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        descRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' },
        '-=0.2'
      )
      .fromTo(
        Array.from(buttonsRef.current?.children || []),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.2 },
        '-=0.1'
      );
  }, []);

  return (
    <section className="flex h-full min-h-screen items-center justify-center">
      <div className="mx-auto max-w-[1000px] space-y-6">
        <div className="font-bold">
          <p ref={titleRef} className="text-[44px] opacity-0 md:text-[60px]">
            Hi, I’m Jesnie,
          </p>
          <p
            ref={subtitleRef}
            className="text-[48px] leading-none opacity-0 md:text-[64px] md:leading-10"
          >
            Full-Stack <span className="text-accent-dark">Developer.</span>
          </p>
        </div>
        <p ref={descRef} className="text-body text-base opacity-0 md:text-xl">
          I’m a developer who builds web applications and keeps learning new
          technologies. I focus on making websites that are clear and easy to
          use. I’m always working on projects that help me grow and get better
          at coding.
        </p>
        <div ref={buttonsRef} className="flex gap-4">
          <a href="#about" className="block h-full opacity-0">
            <PrimaryButton>About</PrimaryButton>
          </a>

          <a
            href="mailto:magalingjesnie@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full opacity-0"
          >
            <SecondaryButton>Email</SecondaryButton>
          </a>
        </div>
      </div>
    </section>
  );
}
