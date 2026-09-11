"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import ThemeToggle from "./ThemeToggle";

interface Position {
  x: number; // left in px
  y: number; // top in px
}

export default function DraggableThemeToggle() {
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  }>({ startX: 0, startY: 0, initialX: 0, initialY: 0, hasMoved: false });

  // Initialize position from localStorage or default viewport placement
  useEffect(() => {
    setMounted(true);

    try {
      const saved = localStorage.getItem("kopawee_theme_pos");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          // Clamp within current screen bounds
          const clampedX = Math.max(12, Math.min(window.innerWidth - 75, parsed.x));
          const clampedY = Math.max(12, Math.min(window.innerHeight - 50, parsed.y));
          setPosition({ x: clampedX, y: clampedY });
          return;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }

    // Default positioning:
    // Mobile (<640px): bottom-20 (80px), right-4 (16px) — safely above mobile bottom navbars
    // Desktop (>=640px): bottom-6 (24px), right-6 (24px)
    const isMobile = window.innerWidth < 640;
    const defaultRight = isMobile ? 16 : 24;
    const defaultBottom = isMobile ? 80 : 24;

    const initialX = window.innerWidth - 65 - defaultRight;
    const initialY = window.innerHeight - 38 - defaultBottom;

    setPosition({ x: Math.max(12, initialX), y: Math.max(12, initialY) });
  }, []);

  // Update bounds on window resize
  useEffect(() => {
    if (!mounted) return;
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return prev;
        const clampedX = Math.max(12, Math.min(window.innerWidth - 75, prev.x));
        const clampedY = Math.max(12, Math.min(window.innerHeight - 50, prev.y));
        return { x: clampedX, y: clampedY };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      dragInfoRef.current = {
        startX: clientX,
        startY: clientY,
        initialX: rect.left,
        initialY: rect.top,
        hasMoved: false,
      };
    },
    []
  );

  const updateDrag = useCallback(
    (clientX: number, clientY: number) => {
      const { startX, startY, initialX, initialY } = dragInfoRef.current;
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (!dragInfoRef.current.hasMoved && Math.hypot(dx, dy) > 6) {
        dragInfoRef.current.hasMoved = true;
        setIsDragging(true);
      }

      if (dragInfoRef.current.hasMoved) {
        const width = containerRef.current?.offsetWidth || 65;
        const height = containerRef.current?.offsetHeight || 38;

        const newX = Math.max(12, Math.min(window.innerWidth - width - 12, initialX + dx));
        const newY = Math.max(12, Math.min(window.innerHeight - height - 12, initialY + dy));

        setPosition({ x: newX, y: newY });
      }
    },
    []
  );

  const endDrag = useCallback(() => {
    if (dragInfoRef.current.hasMoved && position) {
      localStorage.setItem("kopawee_theme_pos", JSON.stringify(position));
    }
    // Short timeout before resetting isDragging to block phantom clicks after drag
    setTimeout(() => setIsDragging(false), 50);
  }, [position]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      updateDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    startDrag(e.clientX, e.clientY);

    const handleMouseMove = (me: MouseEvent) => {
      updateDrag(me.clientX, me.clientY);
    };

    const handleMouseUp = () => {
      endDrag();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  if (!mounted) {
    return null;
  }

  const style: React.CSSProperties = position
    ? {
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
      }
    : {
        position: "fixed",
        bottom: "5rem", // ~80px mobile default
        right: "1rem",  // ~16px mobile default
        zIndex: 9999,
        filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.25))",
      };

  return (
    <div
      ref={containerRef}
      style={style}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      className={`group cursor-grab active:cursor-grabbing transition-transform duration-100 ${
        isDragging ? "scale-105 opacity-90" : "hover:scale-105"
      }`}
      aria-label="Theme toggle (Draggable)"
    >
      <div className={isDragging ? "pointer-events-none" : ""}>
        <ThemeToggle size="13px" />
      </div>
    </div>
  );
}
