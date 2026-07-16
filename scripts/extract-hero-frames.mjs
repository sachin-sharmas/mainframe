// Extracts public/videos/hero.mp4 into an individual WebP image per frame
// (public/videos/hero-frames/frame-NNN.webp). BackgroundVideo.tsx preloads
// these into memory and draws them to a <canvas> instead of driving an
// HTMLVideoElement's currentTime — decoding a video frame-by-frame on every
// mousemove has an inherent seek/decode cost no amount of JS easing removes,
// while drawing an already-decoded bitmap to canvas is effectively instant.
//
// Run after replacing public/videos/hero.mp4 with a new source clip:
//   node scripts/extract-hero-frames.mjs
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import ffmpegPath from "ffmpeg-static";

mkdirSync("public/videos/hero-frames", { recursive: true });

execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i", "public/videos/hero.mp4",
    "-fps_mode", "passthrough",
    "-vf", "scale=1280:-2",
    "-c:v", "libwebp",
    "-lossless", "0",
    "-q:v", "82",
    "-f", "image2",
    "public/videos/hero-frames/frame-%03d.webp",
  ],
  { stdio: "inherit" }
);
