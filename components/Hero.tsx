"use client";

import { motion } from "motion/react";
import { useTypewriter } from "@/hooks/useTypewriter";

export function Hero() {
  const { displayed, done } = useTypewriter(
    "Transforming medicine through gene editing"
  );

  return (
    <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
      <main
        id="spade-hero"
        className="w-full max-w-7xl mx-auto px-6 pt-28 pb-12 sm:pt-32 flex-1 flex flex-col justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-[76px] font-normal tracking-tight text-black leading-[1.08] mb-8 select-none w-full max-w-4xl whitespace-pre-wrap">
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
            )}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-lg md:text-xl text-[#5A635A] leading-relaxed font-normal mb-14 max-w-2xl">
            CRISPR Therapeutics is harnessing the power of CRISPR/Cas9
            technology to develop potentially curative therapies for serious
            diseases.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#"
            className="px-7 py-3.5 rounded-full text-sm font-medium bg-[#1C2E1E] text-white shadow-md shadow-emerald-950/5 hover:opacity-90 transition-opacity"
          >
            Explore Our Science
          </a>
          <a
            href="#"
            className="px-7 py-3.5 rounded-full text-sm font-medium bg-white text-[#1C2E1E] border border-[#F1F3F1] hover:bg-[#F1F3F1]/55 transition-colors"
          >
            View Pipeline
          </a>
        </motion.div>
      </main>
    </div>
  );
}
