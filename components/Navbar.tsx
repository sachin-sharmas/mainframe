"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = ["Labs", "Studio", "Openings", "Shop"];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
      <div className="flex flex-row items-center gap-3">
        <Image
          src="/logo-main.svg"
          alt="Logo"
          width={332.24}
          height={360.81}
          priority
          className="h-8 sm:h-10 w-auto select-none"
        />
      </div>

      <nav className="hidden md:flex flex-row text-[23px] text-black">
        {NAV_LINKS.map((link, i) => (
          <span key={link} className="flex flex-row">
            <Link href="#" className="hover:opacity-60 transition-opacity">
              {link}
            </Link>
            {i < NAV_LINKS.length - 1 && (
              <span className="opacity-40">,&nbsp;</span>
            )}
          </span>
        ))}
      </nav>

      <Link
        href="#"
        className="hidden md:block text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
      >
        Get in touch
      </Link>

      <button
        type="button"
        onClick={() => setIsMobileMenuOpen((open) => !open)}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
        className="md:hidden relative flex flex-col justify-center items-center gap-[5px] w-6 h-6"
      >
        <span
          className={`w-6 h-[2px] bg-black transition-all duration-300 ${
            isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`w-6 h-[2px] bg-black transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`w-6 h-[2px] bg-black transition-all duration-300 ${
            isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </button>

      <div
        className={`md:hidden fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8 transition-opacity duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link}
            href="#"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-3xl text-black hover:opacity-60 transition-opacity"
          >
            {link}
          </Link>
        ))}
        <Link
          href="#"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-3xl text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </Link>
      </div>
    </header>
  );
}
