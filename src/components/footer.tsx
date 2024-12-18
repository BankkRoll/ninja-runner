import { Github, Twitter } from "lucide-react";

import Link from "next/link";
import { ThemeToggle } from "./ui/theme-toggle";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">Ninja Jump</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Need a custom game or have other development needs? Contact me
            </p>
          </div>

          <div className="space-y-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-4">
              <Link
                href="https://x.com/bankkroll_eth"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                )}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://x.com/bankkroll_eth"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                )}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-600 dark:text-neutral-400">
          © {currentYear}
          <Link
            href="https://x.com/bankkroll_eth"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Bankk.{" "}
          </Link>
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}
