'use client';

import SectionHeader from '@/components/SectionHeader';
import { ExternalLink, Github } from 'lucide-react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const projectItems = [
  {
    name: 'ORDERQ',
    description:
      'OrderQ is a responsive restaurant ordering app that lets customers scan a QR code to browse the menu and place dine-in orders without downloading an app. Built with React, TypeScript, Vite, and Tailwind CSS, it includes features like cart management, order status tracking, and digital receipts. A mock backend with JSON Server simulates the full ordering process, making it a great showcase of modern front-end development.',
    stack: ['ReactTS', 'TailwindCSS', 'Shadcn', 'Vite'],
    link: [
      {
        live: '',
        repo: 'https://github.com/jesniemagaling/orderq',
      },
    ],
    image: '/images/orderq-desktop.png',
  },
  {
    name: 'QVEE.CO',
    description:
      'Qveeco Ecommerce is a modern and responsive web storefront built with HTML, CSS, JavaScript, and Vite. It features a clean layout with product listings, categories, and intuitive navigation optimized for both desktop and mobile. The project demonstrates strong front-end skills in styling, layout, and user experience, making it a solid example of a functional ecommerce interface.',
    stack: ['HTML', 'TailwindCSS', 'Javascript', 'Vite'],
    link: [
      {
        live: 'https://jesniemagaling.github.io/qveeco-ecommerce/pages/qveeco.html',
        repo: 'https://github.com/jesniemagaling/qveeco-ecommerce',
      },
    ],
    image: '/images/qveeco-desktop.png',
  },
  {
    name: 'ELECAR',
    description:
      'Elecar is a responsive landing page created using only HTML and CSS. It presents a modern and clean layout with smooth hover effects, consistent styling, and a structure that adjusts well across various screen sizes. The project focuses on core front end skills such as semantic markup, layout design, and visual aesthetics without relying on any external frameworks or libraries. It serves as a strong example of effective and efficient web design using fundamental technologies.',
    stack: ['HTML', 'CSS', 'Javascript'],
    link: [
      {
        live: 'https://jesniemagaling.github.io/elecar/landingpage.html',
        repo: 'https://github.com/jesniemagaling/elecar',
      },
    ],
    image: '/images/elecar-desktop.png',
  },
];

export default function Projects() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

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
  }, []);

  return (
    <>
      <div ref={headerRef}>
        <SectionHeader
          title={'Notable Project'}
          description={
            'Here’s a quick look at some of the projects I’ve worked on. They show the kind of work I enjoy and the skills I do best.'
          }
        />
      </div>
      <div className="mb-36 mt-10 space-y-6">
        {projectItems.map((project, i) => (
          <div
            key={project.name}
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
                className="h-auto w-full rounded-xl object-cover"
              />
            </div>

            <div className="flex w-full flex-col md:mt-2 md:w-1/2">
              <h3 className="mb-2 text-xl font-semibold">{project.name}</h3>
              <p className="text-body text-sm sm:text-base md:line-clamp-4 lg:line-clamp-none">
                {project.description}
              </p>
              <div className="m-4 flex flex-wrap gap-2">
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-secondary-dark dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {project.link.map((link, index) => (
                <div key={index} className="flex gap-4">
                  {link.live && (
                    <a
                      href={link.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="text-black opacity-60 transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
                    </a>
                  )}
                  <a href={link.repo} target="_blank" rel="noopener noreferrer">
                    <Github className="text-black opacity-60 transition-colors duration-100 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 md:h-6 md:w-6" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
