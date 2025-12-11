'use client';

import { useEffect, useRef, useState } from 'react';
import api from '@/lib/axios';
import SectionHeader from '@/components/SectionHeader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Education {
  school: string;
  degree: string;
  startYear: number;
  endYear: number;
}

interface AboutData {
  id: string;
  about: string;
  goal: string;
  education: Education[];
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  const aboutHeaderRef = useRef<HTMLDivElement>(null);
  const aboutTextRefs = useRef<HTMLParagraphElement[]>([]);

  const goalHeaderRef = useRef<HTMLHeadingElement>(null);
  const goalTextRef = useRef<HTMLParagraphElement>(null);

  const eduHeaderRef = useRef<HTMLDivElement>(null);
  const eduItemsRef = useRef<HTMLDivElement[]>([]);

  // Fetch About Data from Firebase API
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get('/about');
        setAboutData(res.data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };
    fetchAbout();
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!aboutData) return;

    // About Section
    if (aboutHeaderRef.current) {
      gsap.fromTo(
        aboutHeaderRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: aboutHeaderRef.current, start: 'top 80%' },
        }
      );
    }

    gsap.fromTo(
      aboutTextRefs.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out',
        scrollTrigger: { trigger: aboutHeaderRef.current, start: 'top 70%' },
      }
    );

    // Goal Section
    if (goalHeaderRef.current && goalTextRef.current) {
      gsap.fromTo(
        goalHeaderRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: goalHeaderRef.current, start: 'top 80%' },
        }
      );

      gsap.fromTo(
        goalTextRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: goalHeaderRef.current, start: 'top 75%' },
        }
      );
    }

    // Education Section
    if (eduHeaderRef.current) {
      gsap.fromTo(
        eduHeaderRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: eduHeaderRef.current, start: 'top 80%' },
        }
      );
    }

    gsap.fromTo(
      eduItemsRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.25,
        ease: 'power3.out',
        scrollTrigger: { trigger: eduHeaderRef.current, start: 'top 75%' },
      }
    );
  }, [aboutData]);

  aboutTextRefs.current = [];
  eduItemsRef.current = [];

  if (!aboutData) return null;

  return (
    <div className="my-36 grid grid-cols-1 gap-[46px] md:grid-cols-2 lg:gap-[84px]">
      {/* Left Column */}
      <div className="max-w-[655px]">
        <div ref={aboutHeaderRef}>
          <SectionHeader title="About Me" />
        </div>
        <p
          ref={(el) => {
            if (el) aboutTextRefs.current[0] = el;
          }}
          className="mt-6 mb-2 text-lg text-body md:text-xl"
        >
          {aboutData.about}
        </p>

        <div>
          <h2
            ref={goalHeaderRef}
            className="text-2xl font-bold md:text-3xl lg:text-[32px]"
          >
            My Goal
          </h2>
          <p ref={goalTextRef} className="mt-2 text-lg text-body md:text-xl">
            {aboutData.goal}
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div>
        <div ref={eduHeaderRef}>
          <SectionHeader title="Education" />
        </div>

        {aboutData.education.map((edu, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) eduItemsRef.current[i] = el;
            }}
            className="mt-5"
          >
            <h2 className="text-xl font-semibold md:text-2xl">{edu.school}</h2>
            <p className="mt-2 mb-4 text-lg text-body md:text-xl">
              {edu.degree}
            </p>
            <h3 className="text-lg font-semibold text-body md:text-xl">
              {edu.startYear} - {edu.endYear}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
