"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/videos/hero.mp4";

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Desktop mouse scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let targetTime = 0;

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
      video.currentTime = targetTime;
    };

    const handleSeeked = () => {
      targetTime = video.currentTime;
    };

    window.addEventListener("mousemove", handleMouseMove);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      video.removeEventListener("seeked", handleSeeked);
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
