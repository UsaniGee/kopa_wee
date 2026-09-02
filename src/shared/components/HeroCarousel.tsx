"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FiArrowRight, 
  FiArrowDown, 
  FiChevronLeft,
  FiChevronRight,
  FiPlay, 
  FiPause 
} from "react-icons/fi";
import { services, type Service } from "@/shared/data/services";

interface HeroCarouselProps {
  onSlideChange?: (index: number) => void;
}

const AUTOPLAY_MS = 6500;

function heroSupportLine(service: Service): string {
  const first = service.storyNarrative.split(/(?<=[.!?])\s+/)[0];
  return first ?? service.tagline;
}

export default function HeroCarousel({ onSlideChange }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isTransitioning = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isTouchDevice = useRef(false);
  const onSlideChangeRef = useRef(onSlideChange);

  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
  }, [onSlideChange]);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      setActiveIndex(((index % services.length) + services.length) % services.length);

      setTimeout(() => {
        isTransitioning.current = false;
      }, 600);
    },
    []
  );

  const next = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const prev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    isTouchDevice.current = true;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice.current) setIsPaused(true);
  };
  const handleMouseLeave = () => {
    if (!isTouchDevice.current) setIsPaused(false);
  };

  useEffect(() => {
    onSlideChangeRef.current?.(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % services.length);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const slide = services[activeIndex];

  const scrollToNextSection = () => {
    const el = document.querySelector("#services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen w-full flex flex-col justify-between bg-[#eaf5ed] dark:bg-[#0a0f0d] text-[#121815] dark:text-slate-100 transition-colors duration-500 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="KopaWee Hero"
    >
      {/* Top Navigation Padding Spacer */}
      <div className="pt-24 sm:pt-28 lg:pt-32" />

      {/* Main Full-Screen Asymmetrical Grid */}
      <div className=" mx-auto px-6 sm:px-10 lg:px-16 w-full flex-1 flex flex-col justify-center py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-12">
          
          {/* Left Column: Airy Typography & Direct Action Buttons */}
          <div className="lg:col-span-6 z-20 relative flex flex-col justify-center text-left">
            <div key={`scandi-hero-left-${activeIndex}`} className="hero-content-enter">
              
              {/* Minimalist Metadata Overline */}
              <div className="flex items-center gap-3 mb-3">
                <span className="h-px w-8 bg-emerald-600 dark:bg-emerald-400" />
                <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-emerald-800 dark:text-emerald-300 font-display">
                  {slide.storyChapter} · {slide.category}
                </p>
              </div>

              {/* High-Impact Confident Display Title */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[7.2rem] font-medium text-[#121815] dark:text-white tracking-tight leading-[0.94] font-display lg:-mr-24 relative z-30 pointer-events-none drop-shadow-xs">
                {slide.id === "camp" ? "KopaWee" : slide.title.split("&")[0].trim()}
              </h1>

              {/* Purposeful Body Copy (Lagom - Form follows function) */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 font-normal leading-relaxed mt-6 sm:mt-8 mb-8 sm:mb-10 max-w-lg">
                {heroSupportLine(slide)}
              </p>

              {/* Direct Action Buttons (No Popups/Modals) */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {/* Primary CTA: GET STARTED -> Sign Up directly */}
                <Link
                  href="/auth?mode=signup"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm tracking-[0.18em] uppercase px-8 sm:px-10 py-4 sm:py-4.5 flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg group rounded-none"
                >
                  <span>GET STARTED</span>
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {/* Secondary CTA: EXPLORE FEATURES -> Smooth scroll */}
                <button
                  onClick={scrollToNextSection}
                  className="border border-[#121815]/30 dark:border-white/30 hover:border-emerald-600 dark:hover:border-emerald-400 text-[#121815] dark:text-white hover:text-emerald-700 font-semibold text-xs sm:text-sm tracking-[0.15em] uppercase px-7 sm:px-8 py-4 sm:py-4.5 flex items-center justify-center gap-2.5 transition-all duration-300 rounded-none cursor-pointer"
                >
                  <span>EXPLORE FEATURES</span>
                  <FiArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Full Bleed Framed Imagery */}
          <div className="lg:col-span-6 relative z-10 w-full mt-4 lg:mt-0">
            <div className="relative w-full max-w-xl lg:max-w-none mx-auto">
              
              {/* Border Lines Frame */}
              <div className="absolute -inset-3 sm:-inset-4 border border-emerald-900/15 dark:border-emerald-500/20 z-0 pointer-events-none" />

              {/* Image Pane */}
              <div key={`scandi-hero-img-${activeIndex}`} className="relative z-10 w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-slate-900 shadow-xl transition-all duration-700">
                {services.map((svc, i) => (
                  <div
                    key={svc.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      i === activeIndex
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-105 z-0"
                    }`}
                  >
                    <Image
                      src={svc.image}
                      alt={svc.imageAlt}
                      fill
                      priority={i <= 1}
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center filter brightness-[0.98] contrast-[1.02]"
                    />
                  </div>
                ))}
              </div>

              {/* Minimalist Slide Navigation Buttons */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-[#eaf5ed]/90 dark:bg-[#0a0f0d]/90 backdrop-blur-md p-1 border border-slate-300 dark:border-slate-800">
                <button
                  onClick={prev}
                  aria-label="Previous service"
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white transition-colors cursor-pointer"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-2 text-slate-700 dark:text-slate-300">
                  0{activeIndex + 1} / 0{services.length}
                </span>
                <button
                  onClick={next}
                  aria-label="Next service"
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-white transition-colors cursor-pointer"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Minimalist Functional Footer */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 w-full py-6 flex flex-row items-center justify-between border-t border-slate-300/70 dark:border-emerald-900/30 text-xs text-slate-600 dark:text-slate-400">
        
        {/* Left: Scroll indicator */}
        <button
          onClick={scrollToNextSection}
          className="flex items-center gap-3 group cursor-pointer text-left"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 transition-colors">
            Scroll to explore
          </span>
          <FiArrowDown className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Center: Slide Indicators */}
        <div className="hidden md:flex items-center gap-2">
          {services.map((svc, i) => (
            <button
              key={svc.id}
              onClick={() => goTo(i)}
              aria-label={`Go to ${svc.title}`}
              className="p-1 transition-all"
            >
              <span
                className={`block h-1 transition-all ${
                  i === activeIndex
                    ? "bg-emerald-600 w-8"
                    : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 w-2"
                }`}
              />
            </button>
          ))}
          <button
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
            className="ml-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            {isPaused ? "Play" : "Pause"}
          </button>
        </div>

        {/* Right: Functional Platform Tag */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>NYSC COMPANION · ACTIVE</span>
        </div>

      </div>
    </section>
  );
}