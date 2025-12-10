'use client';

import SectionHeader from '@/components/SectionHeader';
import { PrimaryButton, SecondaryButton } from '@/components/CustomButtons';
import { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const headerRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const formTitleRef = useRef<HTMLHeadingElement>(null);
  const formDescRef = useRef<HTMLParagraphElement>(null);
  const formItemsRef = useRef<
    (HTMLDivElement | HTMLTextAreaElement | HTMLButtonElement)[]
  >([]);

  const [loading, setLoading] = useState(false);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!formRef.current) return;

    try {
      await emailjs.sendForm(
        'service_f2hrrub',
        'template_38q0u9q',
        formRef.current,
        '-HTl4rU_tkX-7EmKx'
      );
      toast.success('Message sent successfully!');
      formRef.current.reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 80%' },
          }
        );
      }

      if (buttonsRef.current) {
        gsap.fromTo(
          buttonsRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: headerRef.current, start: 'top 75%' },
          }
        );
      }

      if (formTitleRef.current && formDescRef.current) {
        gsap.fromTo(
          [formTitleRef.current, formDescRef.current],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: formTitleRef.current, start: 'top 75%' },
          }
        );
      }

      if (formItemsRef.current.length > 0) {
        gsap.fromTo(
          formItemsRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: formTitleRef.current, start: 'top 70%' },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Reset ref array to avoid duplicate refs
  formItemsRef.current = [];

  return (
    <div ref={containerRef}>
      <div ref={headerRef}>
        <SectionHeader
          title="Contact"
          description="I’m always open to new opportunities and projects where I can contribute and grow. Got an idea in mind? Let’s build it together."
        />
      </div>

      <div ref={buttonsRef} className="mb-8 mt-5 flex gap-4">
        <a href="tel:+639123456789" className="block h-full">
          <PrimaryButton>Call</PrimaryButton>
        </a>
        <a
          href="mailto:magalingjesnie@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          <SecondaryButton>Email</SecondaryButton>
        </a>
      </div>

      <div className="rounded-lg border border-gray-300 p-6 dark:border-[rgba(255,255,255,0.06)] dark:bg-[#1C1C1C] md:p-8">
        <h2 ref={formTitleRef} className="text-lg font-semibold md:text-xl">
          Send Message
        </h2>
        <p
          ref={formDescRef}
          className="mb-6 text-sm opacity-80 dark:opacity-50"
        >
          Fill out the form and I’ll get back to you as soon as possible.
        </p>

        <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
          <input type="hidden" name="title" value="Portfolio Contact Form" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              ref={(el: HTMLDivElement | null) => {
                if (el) formItemsRef.current[0] = el;
              }}
              className="flex flex-col"
            >
              <label className="mb-2 text-sm font-semibold md:text-base">
                Name
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="Enter your name"
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:border-gray-600 focus:outline-none dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>

            <div
              ref={(el: HTMLDivElement | null) => {
                if (el) formItemsRef.current[1] = el;
              }}
              className="flex flex-col"
            >
              <label className="mb-2 text-sm font-semibold md:text-base">
                Email
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="Enter your email"
                className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:border-gray-600 focus:outline-none dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
              />
            </div>
          </div>

          <div
            ref={(el: HTMLDivElement | null) => {
              if (el) formItemsRef.current[2] = el;
            }}
            className="flex flex-col"
          >
            <label className="mb-2 text-sm font-semibold md:text-base">
              Message
            </label>
            <textarea
              required
              name="message"
              placeholder="Enter your message"
              rows={10}
              className="rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-[#7E7D7E] focus:border-gray-600 focus:outline-none dark:border-[rgba(255,255,255,0.06)] dark:focus:border-gray-400"
            ></textarea>
          </div>

          <PrimaryButton
            ref={(el) => {
              if (el) formItemsRef.current[3] = el;
            }}
            type="submit"
            disabled={loading}
            variant="outlined"
            fullWidth
            className="border-[rgba(255, 255, 255, 0.10)] dark:border-[rgba(255,255,255,0.06)]"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
