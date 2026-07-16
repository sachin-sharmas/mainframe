"use client";

import { useEffect, useRef } from "react";

// Re-encoded with every frame as a keyframe (see scripts/reencode-hero.mjs) so
// seeking to any point is a single-frame decode instead of walking forward
// from the last keyframe — the original file had only one keyframe total.
const VIDEO_SRC = "/videos/hero-scrub.mp4";

// Time constant (seconds) for the exponential ease toward the target time —
// lower is snappier, higher is smoother. Using a time constant instead of a
// flat per-frame factor keeps the motion speed consistent across 60/120/144Hz
// displays instead of tying it to however many rAF ticks happen to fire.
const SMOOTHING_TIME_CONSTANT = 0.15;

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Warm up the decoder pipeline once metadata is available so the very
  // first scrub doesn't pay a cold-start decode cost.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.currentTime = 0.001;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  // Desktop mouse scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let targetTime = 0;
    let renderedTime = 0;
    let rafId: number;
    let lastTimestamp: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (!video.duration || Number.isNaN(video.duration)) return;

      if (prevX === null) {
        prevX = e.clientX;
        return;
      }

      const delta = e.clientX - prevX;
      prevX = e.clientX;

      targetTime += (delta / window.innerWidth) * 0.8 * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime));
    };

    // Ease currentTime toward targetTime once per frame instead of seeking
    // synchronously on every raw mousemove event, which is what caused the jank.
    const tick = (timestamp: number) => {
      rafId = requestAnimationFrame(tick);

      if (window.innerWidth < 1024 || !video.duration || Number.isNaN(video.duration)) {
        lastTimestamp = null;
        return;
      }

      const dt = lastTimestamp === null ? 0 : (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const factor = 1 - Math.exp(-dt / SMOOTHING_TIME_CONSTANT);
      renderedTime += (targetTime - renderedTime) * factor;
      if (Math.abs(targetTime - renderedTime) < 0.001) {
        renderedTime = targetTime;
      }
      if (!video.seeking && Math.abs(video.currentTime - renderedTime) > 0.005) {
        video.currentTime = renderedTime;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Mobile autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const applyPlaybackMode = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.play().catch(() => {});
      }
    };

    applyPlaybackMode();
    window.addEventListener("resize", applyPlaybackMode);
    return () => window.removeEventListener("resize", applyPlaybackMode);
  }, []);

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        src={VIDEO_SRC}
        className="w-full h-full object-cover object-right lg:object-right-bottom"
      />
    </div>
  );
}
