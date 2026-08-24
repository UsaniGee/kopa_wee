"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Zap } from "lucide-react";
import { services, type Service } from "@/shared/data/services";

interface HeroCarouselProps {
  onOpenRoleModal: () => void;
  onSlideChange?: (index: number) => void;
}

const AUTOPLAY_MS = 6000;

function heroSupportLine(service: Service): string {
  const first = service.storyNarrative.split(/(?<=[.!?])\s+/)[0];
  return first ?? service.tagline;
}

export default function HeroCarousel({ onOpenRoleModal, onSlideChange }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isTouchDevice = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      const next = ((index % services.length) + services.length) % services.length;
      setActiveIndex(next);
      onSlideChange?.(next);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning, onSlideChange]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

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

  // Only pause on hover for non-touch devices
  const handleMouseEnter = () => {
    if (!isTouchDevice.current) setIsPaused(true);
  };
  const handleMouseLeave = () => {
    if (!isTouchDevice.current) setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, next, activeIndex]);

  const slide = services[activeIndex];

  return (
    <section
      className="relative min-h-svh overflow-hidden bg-white border-b border-[var(--color-border)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="KopaWee service story carousel"
      aria-roledescription="carousel"
    >
      {/* Full background layout */}
      <div className="relative w-full min-h-svh flex items-center pt-24 pb-16">
        {/* Background Images */}
        {services.map((svc, i) => (
          <div
            key={svc.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === activeIndex ? "opacity-100 z-0" : "opacity-0 -z-10"}`}
            aria-hidden={i !== activeIndex}
          >
            <Image
              src={svc.image}
              alt={svc.imageAlt}
              fill
              priority={i <= 1}
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Greenish gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--nysc-green-dark)]/90 via-[var(--nysc-green)]/70 to-black/40" />
          </div>
        ))}

        {/* Copy panel — Text on top */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 flex flex-col justify-center text-center md:text-left text-white max-w-5xl mx-auto md:mx-0 lg:ml-12">
          <div className="max-w-2xl space-y-6 mx-auto md:mx-0">
            <div key={`brand-${activeIndex}`} className="hero-content-enter space-y-1">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                KopaWee<span className="text-emerald-300">+</span>
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-100 drop-shadow-sm">
                NYSC Companion
              </p>
            </div>

            <h1
              key={`headline-${activeIndex}`}
              className="hero-content-enter hero-content-enter-delay-1 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] drop-shadow-lg"
            >
              {slide.storyHeadline}
            </h1>

            <p
              key={`support-${activeIndex}`}
              className="hero-content-enter hero-content-enter-delay-2 text-base sm:text-xl text-emerald-50 leading-relaxed drop-shadow-md max-w-xl mx-auto md:mx-0"
            >
              {heroSupportLine(slide)}
            </p>

            <div
              key={`cta-${activeIndex}`}
              className="hero-content-enter hero-content-enter-delay-3 flex flex-col sm:flex-row items-center md:items-start gap-4 pt-4 justify-center md:justify-start"
            >
              <Link
                href="/auth?mode=signup"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Sign Up Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/auth?mode=signin"
                className="w-full sm:w-auto px-8 py-4 bg-white/20 hover:bg-white hover:text-black text-white font-bold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {services.map((svc, i) => (
                <button
                  key={svc.id}
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${svc.title}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  className="p-1 transition-all"
                >
                  <span
                    className={`block h-2 transition-all ${
                      i === activeIndex
                        ? "bg-emerald-500 w-8"
                        : "bg-slate-200 hover:bg-slate-400 w-2"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-black uppercase tracking-[0.2em] hidden sm:inline">
                {slide.storyChapter}
              </span>
              <button
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Resume autoplay" : "Pause autoplay"}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-black transition-colors"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-black transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 h-1 bg-slate-100 overflow-hidden">
            <div
              key={`progress-${activeIndex}-${isPaused}`}
              className={`h-full bg-emerald-500 ${isPaused ? "" : "hero-progress-bar"}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
