"use client";

import { useEffect, useRef } from "react";

// Frame-sequence player: public/videos/hero.mp4 is pre-extracted into
// individual WebP frames (see scripts/extract-hero-frames.mjs) and drawn to a
// <canvas>. Driving an HTMLVideoElement's currentTime on mousemove was never
// going to be perfectly smooth — every seek is a real decode with real
// latency, however well-encoded the source is. Blitting an already-decoded
// bitmap onto a canvas has no such cost, so this is smooth regardless of how
// fast the mouse moves.
const FRAME_COUNT = 51;
const SOURCE_FPS = 24;
const FRAME_URLS = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/videos/hero-frames/frame-${String(i + 1).padStart(3, "0")}.webp`
);

// Time constant (seconds) for the exponential ease toward the mouse-driven
// target frame — lower is snappier, higher is smoother.
const SMOOTHING_TIME_CONSTANT = 0.15;
const DESKTOP_BREAKPOINT = 1024;

export function BackgroundVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let rafId: number;
    let resizeObserver: ResizeObserver;

    const images: HTMLImageElement[] = [];
    let size = { width: 0, height: 0 };
    let prevX: number | null = null;
    let targetFrame = 0;
    let renderedFrame = 0;
    let lastTimestamp: number | null = null;

    const drawFrame = (frameFloat: number) => {
      const img = images[Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(frameFloat)))];
      if (!img || size.width === 0 || size.height === 0) return;

      const scale = Math.max(size.width / img.width, size.height / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

      const dx = size.width - drawW; // right-aligned, mirrors object-right
      const dy = isDesktop ? size.height - drawH : (size.height - drawH) / 2;

      ctx.clearRect(0, 0, size.width, size.height);
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) return;

      if (prevX === null) {
        prevX = e.clientX;
        return;
      }

      const delta = e.clientX - prevX;
      prevX = e.clientX;

      targetFrame += (delta / window.innerWidth) * 0.8 * (FRAME_COUNT - 1);
      targetFrame = Math.max(0, Math.min(FRAME_COUNT - 1, targetFrame));
    };

    const tick = (timestamp: number) => {
      rafId = requestAnimationFrame(tick);

      const dt = lastTimestamp === null ? 0 : (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        // No mouse to scrub with — auto-advance like a looping video.
        renderedFrame = (renderedFrame + dt * SOURCE_FPS) % FRAME_COUNT;
        targetFrame = renderedFrame;
      } else {
        const factor = 1 - Math.exp(-dt / SMOOTHING_TIME_CONSTANT);
        renderedFrame += (targetFrame - renderedFrame) * factor;
        if (Math.abs(targetFrame - renderedFrame) < 0.001) {
          renderedFrame = targetFrame;
        }
      }

      drawFrame(renderedFrame);
    };

    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const dpr = window.devicePixelRatio || 1;
      size = { width: entry.contentRect.width, height: entry.contentRect.height };
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resizeObserver.observe(container);

    Promise.all(
      FRAME_URLS.map((src) => {
        const img = new Image();
        img.src = src;
        images.push(img);
        return img.decode().catch(() => {});
      })
    ).then(() => {
      if (cancelled) return;
      window.addEventListener("mousemove", handleMouseMove);
      rafId = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
