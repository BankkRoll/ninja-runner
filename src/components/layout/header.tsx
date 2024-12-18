// src/components/layout/header.tsx

"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { ThemeToggle } from "../ui/theme-toggle";
import { cn } from "@/lib/utils";

export function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const sticky = useState(true);

  // Effect for setting up sticky header
  useEffect(() => {
    if (sticky) {
      const handleScroll = () => {
        setHasScrolled(window.scrollY > 20);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [sticky]);

  return (
    <header
      className={cn(
        "mx-auto border-b border-dashed w-full top-0 z-50 flex justify-between items-center px-2 py-4 transition-all duration-300 sm:px-10",
        hasScrolled
          ? "bg-background/40 sticky backdrop-blur"
          : "bg-background opacity-100",
      )}
    >
      <div className="container flex justify-between items-center px-4 md:px-0">
        <Link href="/" className="flex items-center gap-x-2.5">
          <p className="text-xl font-bold">CTJR</p>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
}
