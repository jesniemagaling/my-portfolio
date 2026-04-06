"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  ArrowLeft,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  slug: string;
  stack: string[];
  linkRepo: string;
  linkLive: string;
  image: string;
  images?: string[];
}

// Placeholder slides rendered as pure CSS — no external URLs needed
const PLACEHOLDER_SLIDES = [
  { bg: "#1e1e1e", label: "Screenshot 1" },
  { bg: "#242424", label: "Screenshot 2" },
  { bg: "#2a2a2a", label: "Screenshot 3" },
];

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch project by slug
  useEffect(() => {
    if (!slug) return;
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        setProject(res.data);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchProject();
  }, [slug]);

  const images = project?.images?.length ? project.images : null;
  const totalSlides = images ? images.length : PLACEHOLDER_SLIDES.length;

  const prev = useCallback(
    () => setCurrentIndex((i) => (i === 0 ? totalSlides - 1 : i - 1)),
    [totalSlides],
  );

  const next = useCallback(
    () => setCurrentIndex((i) => (i === totalSlides - 1 ? 0 : i + 1)),
    [totalSlides],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-[900px] space-y-8 py-24 animate-pulse">
        {/* Back link skeleton */}
        <div className="h-4 w-32 rounded-full bg-gray-200 dark:bg-secondary-dark" />

        {/* Slider skeleton */}
        <div
          className="w-full rounded-2xl bg-gray-200 dark:bg-secondary-dark"
          style={{ aspectRatio: "16/9" }}
        />

        {/* Title + icons row */}
        <div className="flex items-start justify-between gap-4 pt-1">
          <div className="h-9 w-2/3 rounded-lg bg-gray-200 dark:bg-secondary-dark" />
          <div className="flex gap-3 pt-1">
            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-secondary-dark" />
            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-secondary-dark" />
          </div>
        </div>

        {/* Description lines */}
        <div className="space-y-3">
          <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-secondary-dark" />
          <div className="h-4 w-[95%] rounded-full bg-gray-200 dark:bg-secondary-dark" />
          <div className="h-4 w-[88%] rounded-full bg-gray-200 dark:bg-secondary-dark" />
          <div className="h-4 w-3/4 rounded-full bg-gray-200 dark:bg-secondary-dark" />
        </div>

        {/* Stack tag pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {[80, 96, 64, 72, 88].map((w) => (
            <div
              key={w}
              className="h-7 rounded-full bg-gray-200 dark:bg-secondary-dark"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[900px] space-y-8 py-24">
      {/* Back link */}
      <div>
        <Link
          href="/#projects"
          className="text-body inline-flex items-center gap-2 text-sm opacity-60 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={15} />
          Back to Projects
        </Link>
      </div>

      {/* Image slider */}
      <div className="relative w-full select-none overflow-hidden rounded-2xl bg-secondary-dark">
        <div>
          {images ? (
            // Real images
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[currentIndex]}
              alt={`${project.name} screenshot ${currentIndex + 1}`}
              className="h-auto w-full rounded-2xl object-cover"
              style={{ aspectRatio: "16/9" }}
            />
          ) : (
            // Placeholder slide (pure CSS, no external URL)
            <div
              className="flex w-full items-center justify-center rounded-2xl"
              style={{
                aspectRatio: "16/9",
                backgroundColor: PLACEHOLDER_SLIDES[currentIndex].bg,
              }}
            >
              <span className="text-sm text-white/30">
                {PLACEHOLDER_SLIDES[currentIndex].label}
              </span>
            </div>
          )}
        </div>

        {/* Prev / Next arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronRight size={20} />
            </button>

            {/* Pagination dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-6 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="absolute right-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
              {currentIndex + 1} / {totalSlides}
            </div>
          </>
        )}
      </div>

      {/* Project info */}
      <div className="space-y-4 pb-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-3xl font-bold md:text-4xl">{project.name}</h1>

          <div className="flex shrink-0 gap-4 pt-1">
            {project.linkLive && (
              <a
                href={project.linkLive}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live site"
              >
                <ExternalLink className="text-black opacity-60 transition-opacity hover:opacity-100 dark:text-white md:h-6 md:w-6" />
              </a>
            )}
            {project.linkRepo && (
              <a
                href={project.linkRepo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
              >
                <Github className="text-black opacity-60 transition-opacity hover:opacity-100 dark:text-white md:h-6 md:w-6" />
              </a>
            )}
          </div>
        </div>

        <p className="text-body text-base leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.stack.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-secondary-dark dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
