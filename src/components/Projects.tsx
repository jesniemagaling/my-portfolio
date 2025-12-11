'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/axios';
import SectionHeader from '@/components/SectionHeader';
import { ExternalLink, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  linkRepo: string;
  linkLive: string;
  image: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Fetch projects from backend
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: window.innerWidth < 768 ? 'top 95%' : 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      tl.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
      tl.from(
        cardsRef.current,
        { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.05 },
        '-=0.2'
      );
    });

    return () => ctx.revert();
  }, [projects]); // re-run GSAP animation after projects load

  return (
    <>
      <div ref={headerRef}>
        <SectionHeader
          title="Notable Projects"
          description="Here’s a quick look at some of the projects I’ve worked on. They show the kind of work I enjoy and the skills I do best."
        />
      </div>

      <div className="mt-10 space-y-6 mb-36">
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            className="flex flex-col items-start gap-6 rounded-2xl border border-transparent p-6 shadow-sm hover:dark:border-[rgba(255,255,255,0.06)] md:flex-row"
          >
            <div className="w-full overflow-hidden rounded-xl md:w-1/2">
              <Image
                src={project.image}
                alt={project.name}
                width={800}
                height={450}
                className="object-cover w-full h-auto rounded-xl"
              />
            </div>

            <div className="flex flex-col w-full md:mt-2 md:w-1/2">
              <h3 className="mb-2 text-xl font-semibold">{project.name}</h3>
              <p className="text-sm text-body sm:text-base md:line-clamp-4 lg:line-clamp-none">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 m-4">
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-secondary-dark dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.linkLive && (
                  <a
                    href={project.linkLive}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="text-black transition-colors duration-100 opacity-60 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
                  </a>
                )}
                {project.linkRepo && (
                  <a
                    href={project.linkRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="text-black transition-colors duration-100 opacity-60 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
