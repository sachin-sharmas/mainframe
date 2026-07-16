// Re-encodes public/videos/hero.mp4 into public/videos/hero-scrub.mp4 with
// every frame as a keyframe (GOP size 1), so BackgroundVideo.tsx can seek to
// any frame instantly while scrubbing on mousemove. The source file only had
// a single keyframe for its whole duration, which made every seek decode
// forward from frame 0 — that was the cause of the scrub lag.
//
// Run after replacing public/videos/hero.mp4 with a new source clip:
//   node scripts/reencode-hero.mjs
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

execFileSync(
  ffmpegPath,
  [
    "-y",
    "-i", "public/videos/hero.mp4",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "20",
    "-g", "1",
    "-keyint_min", "1",
    "-sc_threshold", "0",
    "-vf", "scale=1280:-2",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    "public/videos/hero-scrub.mp4",
  ],
  { stdio: "inherit" }
);
