import Link from "next/link";
import { ThemeToggle } from "./ui/theme-toggle";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold">Ninja Jump</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Empowering your digital journey with innovative solutions.
            </p>
          </div>

          <div className="space-y-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-600 dark:text-neutral-400">
          © {currentYear} Bankk. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
